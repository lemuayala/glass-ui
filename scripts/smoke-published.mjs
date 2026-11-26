#!/usr/bin/env node
/**
 * Post-publish smoke test: exercises the packages exactly as users get them from npm.
 *
 *   node scripts/smoke-published.mjs [version]     (default: version in packages/mcp/package.json)
 *
 * 1. Waits until both packages are publicly installable at <version>. With npm staged publishing,
 *    a CI publish only lands in "Staged Packages" — this step fails with that explanation.
 * 2. MCP: starts `npx -y @lemuayala/glass-ui-mcp@<version>` over stdio with a real MCP client,
 *    checks version, agent instructions, tools, prompt, and generates a component.
 * 3. CLI: runs `npx -y @lemuayala/glass-ui-core@<version> add card` in an empty temp project.
 *
 * Exit codes: 0 ok · 1 smoke failure · 2 version not public on npm (staged or not published).
 */
import { execFile } from "node:child_process"
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { createRequire } from "node:module"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { pathToFileURL } from "node:url"
import { promisify } from "node:util"

const execFileAsync = promisify(execFile)
const isWindows = process.platform === "win32"
// npm/npx are .cmd shims on Windows and need a shell; args here are fixed, not user input.
const run = (cmd, args, opts = {}) =>
  isWindows
    ? execFileAsync([cmd, ...args].join(" "), { ...opts, shell: true })
    : execFileAsync(cmd, args, opts)

const mcpPkgJsonUrl = new URL("../packages/mcp/package.json", import.meta.url)
const mcpPkg = JSON.parse(await readFile(mcpPkgJsonUrl, "utf8"))
const corePkg = JSON.parse(await readFile(new URL("../packages/core/package.json", import.meta.url), "utf8"))

const version = process.argv[2] ?? mcpPkg.version
const VISIBILITY_TIMEOUT_MS = Number(process.env.SMOKE_NPM_WAIT_MS ?? 180_000)

// The MCP SDK is a dependency of the MCP package — resolve it from there.
const requireFromMcp = createRequire(mcpPkgJsonUrl)
const sdkImport = (path) => import(pathToFileURL(requireFromMcp.resolve(path)).href)
const { Client } = await sdkImport("@modelcontextprotocol/sdk/client/index.js")
const { StdioClientTransport } = await sdkImport("@modelcontextprotocol/sdk/client/stdio.js")

const failures = []
const check = (ok, label) => {
  console.log(`${ok ? "  ✓" : "  ✗"} ${label}`)
  if (!ok) failures.push(label)
}

async function isPublic(name) {
  try {
    const { stdout } = await run("npm", ["view", `${name}@${version}`, "version"])
    return stdout.trim() === version
  } catch {
    return false
  }
}

async function waitForNpm(names) {
  const deadline = Date.now() + VISIBILITY_TIMEOUT_MS
  const pending = new Set(names)
  while (pending.size && Date.now() < deadline) {
    for (const name of [...pending]) if (await isPublic(name)) pending.delete(name)
    if (pending.size) await new Promise((r) => setTimeout(r, 10_000))
  }
  return [...pending]
}

async function smokeMcp() {
  console.log(`\nMCP · npx -y ${mcpPkg.name}@${version}`)
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["-y", `${mcpPkg.name}@${version}`],
    stderr: "ignore",
    ...(isWindows ? { shell: true } : {}),
  })
  const client = new Client({ name: "glass-ui-smoke", version: "1.0.0" })
  await client.connect(transport)
  try {
    check(client.getServerVersion()?.version === version, `server reports version ${version}`)
    check((client.getInstructions() ?? "").includes("generate_component"), "sends agent instructions on connect")

    const tools = (await client.listTools()).tools.map((t) => t.name)
    for (const tool of ["list_primitives", "list_presets", "generate_component", "generate_glass_md"]) {
      check(tools.includes(tool), `exposes tool ${tool}`)
    }
    const prompts = client.getServerCapabilities()?.prompts
      ? (await client.listPrompts()).prompts.map((p) => p.name)
      : []
    check(prompts.includes("glass_component"), "exposes prompt glass_component")

    const res = await client.callTool({ name: "generate_component", arguments: { component: "glass-card", platform: "web" } })
    const payload = JSON.parse(res.content?.[0]?.text ?? "null")
    check(!res.isError && !!payload, "generate_component succeeds")
    check(payload?.filePath === "components/ui/glass-card.tsx", "returns filePath")
    check(/export const GlassCard\b/.test(payload?.code ?? ""), "returns GlassCard component code")
    check(typeof payload?.installCommand === "string" && payload.installCommand.length > 0, "returns installCommand")
  } finally {
    await client.close()
  }
}

async function smokeCli() {
  console.log(`\nCLI · npx -y ${corePkg.name}@${version} add card`)
  const dir = await mkdtemp(join(tmpdir(), "glass-ui-smoke-"))
  try {
    await writeFile(join(dir, "package.json"), JSON.stringify({ name: "smoke-app", private: true }))
    await run("npx", ["-y", `${corePkg.name}@${version}`, "add", "card"], { cwd: dir })
    const file = await readFile(join(dir, "components/ui/glass-card.tsx"), "utf8").catch(() => "")
    check(file.length > 0, "writes components/ui/glass-card.tsx")
    check(/export const GlassCard\b/.test(file), "file exports GlassCard")
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

console.log(`Glass UI post-publish smoke test · v${version}`)
const missing = await waitForNpm([corePkg.name, mcpPkg.name])
if (missing.length) {
  const list = missing.map((n) => `${n}@${version}`).join(", ")
  const msg =
    `${list} is not publicly installable after ${VISIBILITY_TIMEOUT_MS / 1000}s. ` +
    "If CI just published it, npm staged publishing is holding it: approve it in npmjs.com → Staged Packages " +
    "(or set the Trusted Publisher permission to “npm publish”), then re-run this job."
  console.error(process.env.GITHUB_ACTIONS ? `::error title=npm version not public::${msg}` : msg)
  process.exit(2)
}

await smokeMcp()
await smokeCli()

if (failures.length) {
  console.error(`\n${failures.length} check(s) failed.`)
  process.exit(1)
}
console.log("\nAll smoke checks passed.")
