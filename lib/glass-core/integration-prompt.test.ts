import { describe, expect, it } from "vitest"
import { generateCode } from "./codegen"
import { generateGlassPrompt, generateShortGlassPrompt } from "./integration-prompt"
import { DEFAULT_PROJECT_PROFILE } from "./project-profile"
import type { CodegenInput, ComponentKind } from "./types"

const components: ComponentKind[] = [
  "glass-card",
  "glass-button",
  "glass-input",
  "glass-modal",
  "glass-tabbar",
  "glass-switch",
  "glass-navbar",
]

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
})

describe("generateShortGlassPrompt", () => {
  it("includes component label and props", () => {
    const codegen: CodegenInput = {
      component: "glass-switch",
      mode: "reusable",
      platform: "web",
      options: baseOptions,
    }
    const short = generateShortGlassPrompt({ codegen, profile: DEFAULT_PROJECT_PROFILE })
    expect(short).toContain("GlassSwitch")
    expect(short).toContain("theme=dark")
  })
})

describe("generateCode", () => {
  it.each(components)("exports web reusable for %s", (component) => {
    const code = generateCode({
      component,
      mode: "reusable",
      platform: "web",
      options: baseOptions,
    })
    expect(code).not.toContain("Unsupported")
    expect(code.length).toBeGreaterThan(100)
  })
})
