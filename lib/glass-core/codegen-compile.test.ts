import ts from "typescript"
import { describe, expect, it } from "vitest"
import { generateCode, generateUsageSnippet } from "./codegen"
import type { ComponentKind, ExportMode, GlassOptions, Platform } from "./types"

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

const baseOptions: GlassOptions = {
  theme: "dark",
  blur: "lg",
  rounded: "2xl",
  intensity: "medium",
  border: "subtle",
  padding: "md",
  shadow: "lg",
  tint: "teal",
  text: "Now Playing",
}

const hostileTexts = [
  "",
  'Say "Hello" & \'World\'',
  "Price: {100} $USD }{",
  "<script>alert(1)</script> <View>",
  "Line 1\\nLine 2\nSecond line",
  "Música en vivo · iOS 26 ✨",
]

function assertValidTsx(source: string, label: string) {
  const result = ts.transpileModule(source, {
    fileName: `${label}.tsx`,
    reportDiagnostics: true,
    compilerOptions: {
      jsx: ts.JsxEmit.ReactJSX,
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
      strict: true,
    },
  })

  const diagnostics = (result.diagnostics ?? []).map((d) =>
    ts.flattenDiagnosticMessageText(d.messageText, "\n"),
  )
  expect(diagnostics, `TSX syntax errors in ${label}:\n${source}`).toEqual([])
  expect(result.outputText.length).toBeGreaterThan(20)
}

function wrapUsageSnippetAsModule(snippet: string): string {
  // Stateful examples (e.g. GlassSwitch) are already complete components.
  if (/^export function /m.test(snippet)) return snippet
  const lines = snippet.split("\n")
  const imports = lines.filter((line) => line.startsWith("import "))
  const body = lines.filter((line) => !line.startsWith("import ")).join("\n")
  return `${imports.join("\n")}
export function UsageWrapper() {
  return (
    <>
      ${body}
    </>
  )
}
`
}

describe("codegen real TSX compilation", () => {
  for (const theme of ["dark", "light"] as const) {
    for (const platform of platforms) {
      for (const mode of modes) {
        it.each(components)(
          `transpiles ${theme} ${platform} ${mode} %s cleanly`,
          (component) => {
            const code = generateCode({
              component,
              mode,
              platform,
              options: { ...baseOptions, theme },
            })
            assertValidTsx(code, `${component}-${theme}-${platform}-${mode}`)
          },
        )
      }
    }
  }

  for (const nativeBlur of ["expo-blur", "nativewind"] as const) {
    for (const blur of ["none", "lg"] as const) {
      for (const mode of modes) {
        it.each(components)(
          `transpiles native (${nativeBlur}, blur=${blur}, ${mode}) %s cleanly`,
          (component) => {
            const code = generateCode({
              component,
              mode,
              platform: "native",
              nativeBlur,
              options: { ...baseOptions, blur },
            })
            assertValidTsx(code, `${component}-${nativeBlur}-${blur}-${mode}`)
            if (nativeBlur === "expo-blur" && (mode === "reusable" || blur !== "none")) {
              expect(code).toContain("expo-blur")
              expect(code).toContain("<BlurView")
            }
            if (nativeBlur === "nativewind") {
              expect(code).not.toContain("expo-blur")
            }
          },
        )
      }
    }
  }

  for (const text of hostileTexts) {
    it(`transpiles all 28 variants and 14 usage snippets safely for text=${JSON.stringify(text)}`, () => {
      for (const component of components) {
        const options: GlassOptions = { ...baseOptions, text }
        for (const platform of platforms) {
          for (const mode of modes) {
            const code = generateCode({ component, mode, platform, options })
            assertValidTsx(code, `${component}-${platform}-${mode}-hostile`)
          }
          const usage = generateUsageSnippet({
            component,
            mode: "reusable",
            platform,
            options,
          })
          assertValidTsx(wrapUsageSnippetAsModule(usage), `${component}-${platform}-usage`)
        }
      }
    })
  }

  it("reflects dynamic options in inline modal and inline tabbar exports", () => {
    const lightAqua: GlassOptions = {
      theme: "light",
      blur: "sm",
      rounded: "xl",
      intensity: "subtle",
      border: "strong",
      padding: "lg",
      shadow: "sm",
      tint: "orange",
      text: "Save Mix?",
    }

    const modalInline = generateCode({
      component: "glass-modal",
      mode: "inline",
      platform: "web",
      options: lightAqua,
    })
    expect(modalInline).toContain("backdrop-blur-sm")
    expect(modalInline).toContain("bg-orange-500/20")
    expect(modalInline).toContain("border-2")
    expect(modalInline).toContain("Save Mix?")

    const tabbarInline = generateCode({
      component: "glass-tabbar",
      mode: "inline",
      platform: "web",
      options: lightAqua,
    })
    expect(tabbarInline).toContain("backdrop-blur-sm")
    expect(tabbarInline).toContain("bg-orange-500/20")
    expect(tabbarInline).toContain("rounded-xl")
  })
})
