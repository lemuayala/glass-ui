import path from "node:path"
import ts from "typescript"
import { describe, expect, it } from "vitest"
import { generateCode, generateUsageSnippet } from "./codegen"
import { ALL_COMPONENTS, PRESETS, applyPreset, defaultsForComponent } from "./presets"

/**
 * Full type-check (not just syntax) of the reusable web components users install via the CLI,
 * the MCP server and the shadcn registry, plus their usage snippets. Files are virtual, placed
 * under the repo root so `react`, `class-variance-authority`, `clsx` and `tailwind-merge`
 * resolve from node_modules exactly as they would in a user's project.
 */
const ROOT = path.resolve(__dirname, "../..")
const VIRTUAL_DIR = path.join(ROOT, "__codegen_typecheck__")

const COMPILER_OPTIONS: ts.CompilerOptions = {
  target: ts.ScriptTarget.ES2020,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  jsx: ts.JsxEmit.ReactJSX,
  strict: true,
  noEmit: true,
  skipLibCheck: true,
  esModuleInterop: true,
  lib: ["lib.dom.d.ts", "lib.es2020.d.ts"],
  types: [],
}

function typecheck(files: Record<string, string>): string[] {
  const virtual = new Map(Object.entries(files).map(([name, text]) => [path.join(VIRTUAL_DIR, name), text]))
  const host = ts.createCompilerHost(COMPILER_OPTIONS)
  const norm = (f: string) => path.resolve(f)
  const readFile = host.readFile.bind(host)
  const fileExists = host.fileExists.bind(host)
  const getSourceFile = host.getSourceFile.bind(host)
  host.readFile = (f) => virtual.get(norm(f)) ?? readFile(f)
  host.fileExists = (f) => virtual.has(norm(f)) || fileExists(f)
  const directoryExists = host.directoryExists?.bind(host)
  host.directoryExists = (d) =>
    [...virtual.keys()].some((f) => f.startsWith(norm(d) + path.sep)) || (directoryExists?.(d) ?? true)
  host.getSourceFile = (f, lang, onError, create) => {
    const text = virtual.get(norm(f))
    return text !== undefined ? ts.createSourceFile(f, text, lang, true, ts.ScriptKind.TSX) : getSourceFile(f, lang, onError, create)
  }

  const program = ts.createProgram([...virtual.keys()], COMPILER_OPTIONS, host)
  return ts.getPreEmitDiagnostics(program).map((d) => {
    const where = d.file ? `${path.relative(VIRTUAL_DIR, d.file.fileName)}:${d.file.getLineAndCharacterOfPosition(d.start ?? 0).line + 1}` : ""
    return `${where} ${ts.flattenDiagnosticMessageText(d.messageText, "\n")}`
  })
}

describe("generated web components type-check", () => {
  for (const preset of [undefined, PRESETS.find((p) => p.id === "liquid")!]) {
    it(`reusable components and usage snippets compile with strict TypeScript (${preset?.id ?? "defaults"})`, () => {
      const files: Record<string, string> = {}
      for (const component of ALL_COMPONENTS) {
        const base = defaultsForComponent(component)
        const options = preset ? applyPreset(preset, base.text) : base
        const codegen = { component, mode: "reusable" as const, platform: "web" as const, options }
        files[`components/ui/${component}.tsx`] = generateCode(codegen)
        files[`usage-${component}.tsx`] = `${generateUsageSnippet(codegen, "components/ui")}\nexport {}\n`
      }
      expect(typecheck(files)).toEqual([])
    }, 30_000)
  }
})
