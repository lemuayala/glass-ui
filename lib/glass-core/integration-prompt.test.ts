import { describe, expect, it } from "vitest"
import { generateCode, generateUsageSnippet } from "./codegen"
import { generateGlassPrompt, generateShortGlassPrompt } from "./integration-prompt"
import { findMatchingPreset, PRESETS } from "./presets"
import { DEFAULT_PROJECT_PROFILE } from "./project-profile"
import type { CodegenInput, ComponentKind, ExportMode, Platform } from "./types"

const components: ComponentKind[] = [
  "glass-card",
  "glass-button",
  "glass-input",
  "glass-modal",
  "glass-tabbar",
  "glass-switch",
  "glass-navbar",
]

const modes: ExportMode[] = ["inline", "reusable"]
const platforms: Platform[] = ["web", "native"]

const baseOptions = {
  theme: "dark" as const,
  blur: "md" as const,
  rounded: "2xl" as const,
  intensity: "medium" as const,
  border: "subtle" as const,
  padding: "md" as const,
  shadow: "md" as const,
  tint: "none" as const,
  text: "Test",
}

describe("generateCode (all 28 variants)", () => {
  for (const platform of platforms) {
    for (const mode of modes) {
      it.each(components)(`exports ${platform} ${mode} for %s`, (component) => {
        const code = generateCode({
          component,
          mode,
          platform,
          options: baseOptions,
        })
        expect(code).not.toContain("Unsupported")
        expect(code.length).toBeGreaterThan(80)
        if (platform === "native") {
          expect(code).toContain("react-native")
        }
        if (mode === "reusable") {
          expect(code).toContain("cva(")
        }
      })
    }
  }
})

describe("generateUsageSnippet", () => {
  it("uses default components/ui path and respects custom componentPath", () => {
    const input: CodegenInput = {
      component: "glass-card",
      mode: "reusable",
      platform: "web",
      options: baseOptions,
    }
    expect(generateUsageSnippet(input)).toContain('from "./components/ui/glass-card"')
    expect(generateUsageSnippet(input, "src/components/glass")).toContain(
      'from "./src/components/glass/glass-card"',
    )
    expect(generateUsageSnippet(input, "@/components/glass")).toContain(
      'from "@/components/glass/glass-card"',
    )
  })
})

describe("generateGlassPrompt", () => {
  it.each(components)("generates GLASS.md for %s web reusable", (component) => {
    const codegen: CodegenInput = {
      component,
      mode: "reusable",
      platform: "web",
      options: baseOptions,
    }
    const md = generateGlassPrompt({ codegen, profile: DEFAULT_PROJECT_PROFILE })
    expect(md).toContain("# GLASS.md")
    expect(md).toContain("## 4. Generated code")
    expect(md).toContain(generateCode(codegen).trim().slice(0, 40))
  })

  it("includes presetName, shareUrl, and custom componentPath in usage", () => {
    const codegen: CodegenInput = {
      component: "glass-button",
      mode: "reusable",
      platform: "native",
      options: baseOptions,
    }
    const md = generateGlassPrompt({
      codegen,
      profile: { ...DEFAULT_PROJECT_PROFILE, componentPath: "src/ui" },
      presetName: "Liquid Glass",
      shareUrl: "https://glass-ui-play.vercel.app/play?c=button",
    })
    expect(md).toContain("| Preset | Liquid Glass |")
    expect(md).toContain("| Design link | https://glass-ui-play.vercel.app/play?c=button |")
    expect(md).toContain('from "./src/ui/glass-button"')
  })
})

describe("generateShortGlassPrompt", () => {
  it("requests CVA component file in reusable mode", () => {
    const codegen: CodegenInput = {
      component: "glass-switch",
      mode: "reusable",
      platform: "web",
      options: baseOptions,
    }
    const short = generateShortGlassPrompt({ codegen, profile: DEFAULT_PROJECT_PROFILE })
    expect(short).toContain("GlassSwitch (reusable, web)")
    expect(short).toContain("theme=dark")
    expect(short).toContain("Use CVA + tailwind-merge")
  })

  it("requests inline JSX without CVA wrapper in inline mode", () => {
    const codegen: CodegenInput = {
      component: "glass-switch",
      mode: "inline",
      platform: "native",
      options: baseOptions,
    }
    const short = generateShortGlassPrompt({ codegen, profile: DEFAULT_PROJECT_PROFILE })
    expect(short).toContain("GlassSwitch (inline, native)")
    expect(short).toContain("no separate CVA wrapper file")
    expect(short).not.toContain("Use CVA + tailwind-merge")
  })
})

describe("findMatchingPreset", () => {
  it("matches presets ignoring custom text and returns undefined when modified", () => {
    const liquid = PRESETS.find((p) => p.id === "liquid")!
    expect(findMatchingPreset({ ...liquid.options, text: "Custom title" })?.id).toBe("liquid")
    expect(findMatchingPreset({ ...liquid.options, blur: "sm" })).toBeUndefined()
  })
})
