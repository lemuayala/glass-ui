import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { runGlassCli } from "./cli-runner.js"

describe("@glass-ui/core CLI installer (runGlassCli)", () => {
  let tempDir: string
  let out: string[]
  let err: string[]

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "glass-ui-cli-"))
    out = []
    err = []
  })

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true })
  })

  const io = () => ({
    cwd: tempDir,
    stdout: (m: string) => out.push(m),
    stderr: (m: string) => err.push(m),
  })

  it("prints help and lists primitives and presets", () => {
    expect(runGlassCli(["--help"], io())).toBe(0)
    expect(out.join("\n")).toContain("Glass UI CLI")

    out = []
    expect(runGlassCli(["list"], io())).toBe(0)
    expect(out.join("\n")).toContain("card, button, input")
    expect(out.join("\n")).toContain("liquid")
  })

  it("installs a native expo-blur component + GLASS.md and protects existing files without --force", () => {
    const code = runGlassCli(
      ["add", "button", "--native", "--preset", "liquid", "--dir", "src/ui", "--glass-md"],
      io(),
    )
    expect(code).toBe(0)

    const tsxPath = join(tempDir, "src/ui/glass-button.tsx")
    const mdPath = join(tempDir, "src/ui/GLASS-button.md")
    expect(existsSync(tsxPath)).toBe(true)
    expect(existsSync(mdPath)).toBe(true)
    expect(readFileSync(tsxPath, "utf8")).toContain("expo-blur")
    expect(readFileSync(mdPath, "utf8")).toContain("| Preset | Liquid Glass |")

    // Re-running without --force skips overwriting
    err = []
    expect(runGlassCli(["add", "button", "--dir", "src/ui"], io())).toBe(0)
    expect(err.join("\n")).toContain("Skipped")

    // Re-running with --force overwrites with web version
    expect(runGlassCli(["add", "button", "--dir", "src/ui", "--force"], io())).toBe(0)
    expect(readFileSync(tsxPath, "utf8")).not.toContain("expo-blur")
  })

  it("installs all 7 primitives with `add all` and validates invalid args", () => {
    expect(runGlassCli(["add", "all"], io())).toBe(0)
    expect(existsSync(join(tempDir, "components/ui/glass-card.tsx"))).toBe(true)
    expect(existsSync(join(tempDir, "components/ui/glass-navbar.tsx"))).toBe(true)

    expect(runGlassCli(["unknown-cmd"], io())).toBe(1)
    expect(runGlassCli(["add"], io())).toBe(1)
    expect(runGlassCli(["add", "nope"], io())).toBe(1)
    expect(runGlassCli(["add", "card", "--preset", "bad-preset"], io())).toBe(1)
  })
})
