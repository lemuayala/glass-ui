import ts from "typescript"
import { describe, expect, it } from "vitest"
import {
  ALL_COMPONENTS,
  GLASS_UI_REGISTRY_URL,
  PRESETS,
  REGISTRY_ALL_ITEM,
  buildRegistry,
  getComponentDependencies,
  getRegistryItem,
  listRegistryItemNames,
  listRegistryItemSpecs,
  registryItemName,
  shadcnAddCommand,
} from "./registry"

const BASE = "https://example.test/r"

function transpileDiagnostics(source: string): string[] {
  const result = ts.transpileModule(source, {
    fileName: "item.tsx",
    reportDiagnostics: true,
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ESNext, module: ts.ModuleKind.ESNext },
  })
  return (result.diagnostics ?? []).map((d) => ts.flattenDiagnosticMessageText(d.messageText, "\n"))
}

describe("shadcn registry", () => {
  it("names items <component>[-<preset>][-native]", () => {
    expect(registryItemName("glass-card")).toBe("glass-card")
    expect(registryItemName("glass-card", { presetId: "liquid" })).toBe("glass-card-liquid")
    expect(registryItemName("glass-button", { platform: "native" })).toBe("glass-button-native")
    expect(registryItemName("glass-modal", { platform: "native", presetId: "aqua" })).toBe("glass-modal-aqua-native")
  })

  it("covers every primitive × (default + presets) × platform, plus the all-in-one item, with unique names", () => {
    const names = listRegistryItemNames()
    expect(listRegistryItemSpecs()).toHaveLength(ALL_COMPONENTS.length * (PRESETS.length + 1) * 2)
    expect(names[0]).toBe(REGISTRY_ALL_ITEM)
    expect(new Set(names).size).toBe(names.length)
    for (const name of names) expect(name).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  })

  it("builds every item as a valid shadcn registry:ui item with compilable TSX", () => {
    for (const { name, platform } of listRegistryItemSpecs()) {
      const item = getRegistryItem(name, BASE)!
      expect(item.$schema).toBe("https://ui.shadcn.com/schema/registry-item.json")
      expect(item).toMatchObject({ name, type: "registry:ui" })
      expect(item.title.length).toBeGreaterThan(0)
      expect(item.description.length).toBeGreaterThan(0)
      expect(item.dependencies).toEqual(getComponentDependencies(platform))
      expect(item.files).toHaveLength(1)
      const [file] = item.files!
      expect(file.type).toBe("registry:ui")
      expect(file.path).toMatch(/^registry\/glass-ui\/glass-[a-z]+\.tsx$/)
      expect(transpileDiagnostics(file.content!), name).toEqual([])
      expect(item.docs).toContain("Usage:")
    }
  })

  it("applies presets and platforms to the generated code", () => {
    const base = getRegistryItem("glass-card", BASE)!.files![0].content
    expect(getRegistryItem("glass-card-liquid", BASE)!.files![0].content).not.toBe(base)
    const native = getRegistryItem("glass-card-native", BASE)!
    expect(native.files![0].content).toContain("expo-blur")
    expect(native.dependencies).toContain("expo-blur")
  })

  it("all-in-one item depends on every web primitive by URL", () => {
    const all = getRegistryItem(REGISTRY_ALL_ITEM, BASE)!
    expect(all.registryDependencies).toEqual(ALL_COMPONENTS.map((c) => `${BASE}/${c}.json`))
    expect(all.files).toBeUndefined()
  })

  it("index lists every item without file content", () => {
    const registry = buildRegistry(BASE, "https://example.test")
    expect(registry).toMatchObject({
      $schema: "https://ui.shadcn.com/schema/registry.json",
      name: "glass-ui",
      homepage: "https://example.test",
    })
    expect(registry.items.map((i) => i.name)).toEqual(listRegistryItemNames())
    for (const item of registry.items) {
      for (const file of item.files ?? []) expect(file.content).toBeUndefined()
      expect(item.docs).toBeUndefined()
    }
  })

  it("returns undefined for unknown items and builds shadcn add commands", () => {
    expect(getRegistryItem("glass-nope", BASE)).toBeUndefined()
    expect(shadcnAddCommand("glass-card")).toBe(`npx shadcn@latest add ${GLASS_UI_REGISTRY_URL}/glass-card.json`)
    expect(shadcnAddCommand("glass-card", `${BASE}/`)).toBe(`npx shadcn@latest add ${BASE}/glass-card.json`)
  })
})
