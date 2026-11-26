import { existsSync, mkdirSync, writeFileSync } from "node:fs"
import { join, resolve } from "node:path"
import { generateCode } from "./codegen.js"
import { generateGlassPrompt } from "./integration-prompt.js"
import { ALL_COMPONENTS, PRESETS, applyPreset, defaultsForComponent } from "./presets.js"
import { DEFAULT_PROJECT_PROFILE, getInstallCommand } from "./project-profile.js"
import type { ComponentKind, ExportMode, NativeBlurMode, Platform } from "./types.js"

const SHORT_TO_COMPONENT: Record<string, ComponentKind> = {
  card: "glass-card",
  "glass-card": "glass-card",
  button: "glass-button",
  "glass-button": "glass-button",
  input: "glass-input",
  "glass-input": "glass-input",
  modal: "glass-modal",
  "glass-modal": "glass-modal",
  tabbar: "glass-tabbar",
  "glass-tabbar": "glass-tabbar",
  switch: "glass-switch",
  "glass-switch": "glass-switch",
  navbar: "glass-navbar",
  "glass-navbar": "glass-navbar",
}

export interface CliIo {
  cwd: string
  stdout: (msg: string) => void
  stderr: (msg: string) => void
}

const HELP_TEXT = `Glass UI CLI (@lemuayala/glass-ui-core)

Usage:
  npx @lemuayala/glass-ui-core add <primitive|all> [options]
  npx @lemuayala/glass-ui-core list

Primitives:
  card, button, input, modal, tabbar, switch, navbar, all

Options:
  --native           Generate React Native component (defaults to expo-blur)
  --nativewind       Use pure NativeWind classes instead of expo-blur (with --native)
  --inline           Generate inline snippet instead of reusable CVA component
  --preset <id>      Apply curated preset (frosted, liquid, smoked, crystal, sunset, aqua)
  --dir <path>       Output directory (default: components/ui)
  --glass-md         Also write GLASS-<primitive>.md alongside the component
  --force            Overwrite existing files
  -h, --help         Show this help message
`

export function runGlassCli(argv: string[], io: CliIo): number {
  if (argv.length === 0 || argv.includes("-h") || argv.includes("--help")) {
    io.stdout(HELP_TEXT)
    return 0
  }

  const command = argv[0]

  if (command === "list") {
    io.stdout("Primitives:\n  " + ALL_COMPONENTS.map((c) => c.replace("glass-", "")).join(", "))
    io.stdout(
      "\nPresets:\n  " + PRESETS.map((p) => `${p.id} (${p.name} — ${p.description})`).join("\n  "),
    )
    return 0
  }

  if (command !== "add") {
    io.stderr(`Unknown command: ${command}\n\n${HELP_TEXT}`)
    return 1
  }

  const targetArg = argv[1]
  if (!targetArg || targetArg.startsWith("-")) {
    io.stderr("Missing primitive name (e.g. `npx @lemuayala/glass-ui-core add card` or `all`).")
    return 1
  }

  const targets: ComponentKind[] =
    targetArg === "all"
      ? [...ALL_COMPONENTS]
      : SHORT_TO_COMPONENT[targetArg]
        ? [SHORT_TO_COMPONENT[targetArg]]
        : []

  if (targets.length === 0) {
    io.stderr(`Unknown primitive "${targetArg}". Run \`npx @lemuayala/glass-ui-core list\` to see options.`)
    return 1
  }

  const platform: Platform = argv.includes("--native") ? "native" : "web"
  const nativeBlur: NativeBlurMode = argv.includes("--nativewind") ? "nativewind" : "expo-blur"
  const mode: ExportMode = argv.includes("--inline") ? "inline" : "reusable"
  const emitGlassMd = argv.includes("--glass-md")
  const force = argv.includes("--force")

  const dirIdx = argv.indexOf("--dir")
  const outDirRel = dirIdx !== -1 && argv[dirIdx + 1] ? argv[dirIdx + 1] : "components/ui"

  const presetIdx = argv.indexOf("--preset")
  const presetId = presetIdx !== -1 ? argv[presetIdx + 1] : undefined
  const preset = presetId ? PRESETS.find((p) => p.id === presetId) : undefined
  if (presetId && !preset) {
    io.stderr(`Unknown preset "${presetId}". Available: ${PRESETS.map((p) => p.id).join(", ")}`)
    return 1
  }

  const absOutDir = resolve(io.cwd, outDirRel)
  mkdirSync(absOutDir, { recursive: true })

  const written: string[] = []
  for (const component of targets) {
    const baseOpts = defaultsForComponent(component)
    const options = preset ? applyPreset(preset, baseOpts.text) : baseOpts
    const codegen = { component, mode, platform, nativeBlur, options }
    const tsxPath = join(absOutDir, `${component}.tsx`)

    if (existsSync(tsxPath) && !force) {
      io.stderr(`Skipped ${outDirRel}/${component}.tsx (already exists; pass --force to overwrite)`)
      continue
    }

    writeFileSync(tsxPath, generateCode(codegen), "utf8")
    written.push(`${outDirRel}/${component}.tsx`)

    if (emitGlassMd) {
      const mdName = `GLASS-${component.replace("glass-", "")}.md`
      const mdPath = join(absOutDir, mdName)
      // Same rule as the component: an existing GLASS.md may have the user's own notes.
      if (existsSync(mdPath) && !force) {
        io.stderr(`Skipped ${outDirRel}/${mdName} (already exists; pass --force to overwrite)`)
        continue
      }
      const md = generateGlassPrompt({
        codegen,
        profile: {
          ...DEFAULT_PROJECT_PROFILE,
          framework: platform === "native" ? "expo" : "next-app-router",
          componentPath: outDirRel,
        },
        presetName: preset?.name,
      })
      writeFileSync(mdPath, md, "utf8")
      written.push(`${outDirRel}/${mdName}`)
    }
  }

  if (written.length > 0) {
    io.stdout(`Created ${written.length} file(s):\n  - ${written.join("\n  - ")}`)
    const installCmd = getInstallCommand(
      { ...DEFAULT_PROJECT_PROFILE, packageManager: "pnpm" },
      platform,
      nativeBlur,
    )
    io.stdout(`\nRequired peer utilities:\n  ${installCmd.replace(/\n/g, "\n  ")}`)
  }

  return 0
}
