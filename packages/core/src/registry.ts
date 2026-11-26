/**
 * shadcn-compatible registry built from the same templates as the CLI and the MCP server.
 *
 * Users install with the shadcn CLI:
 *   npx shadcn@latest add https://glass-ui-play.vercel.app/r/glass-card.json
 *
 * Item names: `<component>[-<preset>][-native]`, e.g. `glass-card`, `glass-card-liquid`,
 * `glass-button-native`. `glass-ui` installs every web primitive with default styling.
 *
 * Schemas: https://ui.shadcn.com/schema/registry.json · https://ui.shadcn.com/schema/registry-item.json
 */
import { generateCode, generateUsageSnippet } from "./codegen.js"
import { COMPONENT_LABELS } from "./integration-prompt.js"
import { ALL_COMPONENTS, PRESETS, applyPreset, defaultsForComponent } from "./presets.js"
import type { GlassPreset } from "./presets.js"
import { getComponentDependencies } from "./project-profile.js"
import type { ComponentKind, Platform } from "./types.js"

/** Public registry served by the Glass UI site. */
export const GLASS_UI_REGISTRY_URL = "https://glass-ui-play.vercel.app/r"
export const GLASS_UI_HOMEPAGE = "https://glass-ui-play.vercel.app"
/** Item that installs every web primitive at once. */
export const REGISTRY_ALL_ITEM = "glass-ui"

const REGISTRY_SCHEMA = "https://ui.shadcn.com/schema/registry.json"
const REGISTRY_ITEM_SCHEMA = "https://ui.shadcn.com/schema/registry-item.json"

export interface RegistryFile {
  path: string
  type: "registry:ui"
  /** Present in item JSON, omitted in the registry index. */
  content?: string
}

export interface RegistryItem {
  $schema?: string
  name: string
  type: "registry:ui"
  title: string
  description: string
  dependencies?: string[]
  registryDependencies?: string[]
  files?: RegistryFile[]
  categories?: string[]
  docs?: string
}

export interface Registry {
  $schema: string
  name: string
  homepage: string
  items: RegistryItem[]
}

export interface RegistryItemSpec {
  name: string
  component: ComponentKind
  platform: Platform
  preset?: GlassPreset
}

export function registryItemName(
  component: ComponentKind,
  { platform = "web", presetId }: { platform?: Platform; presetId?: string } = {},
): string {
  return [component, presetId, platform === "native" ? "native" : undefined].filter(Boolean).join("-")
}

/** Every installable component item: each primitive × (default + presets) × (web, native). */
export function listRegistryItemSpecs(): RegistryItemSpec[] {
  const specs: RegistryItemSpec[] = []
  for (const component of ALL_COMPONENTS) {
    for (const platform of ["web", "native"] as const) {
      for (const preset of [undefined, ...PRESETS]) {
        specs.push({ name: registryItemName(component, { platform, presetId: preset?.id }), component, platform, preset })
      }
    }
  }
  return specs
}

function trimBase(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, "")
}

export function registryItemUrl(name: string, baseUrl = GLASS_UI_REGISTRY_URL): string {
  return `${trimBase(baseUrl)}/${name}.json`
}

export function shadcnAddCommand(name: string, baseUrl = GLASS_UI_REGISTRY_URL): string {
  return `npx shadcn@latest add ${registryItemUrl(name, baseUrl)}`
}

function describe(spec: RegistryItemSpec): { title: string; description: string } {
  const label = COMPONENT_LABELS[spec.component]
  const platformLabel = spec.platform === "native" ? "React Native (expo-blur + NativeWind)" : "React + Tailwind CSS"
  const title = [label, spec.preset?.name, spec.platform === "native" ? "Native" : undefined].filter(Boolean).join(" · ")
  const style = spec.preset ? `${spec.preset.name} preset: ${spec.preset.description}` : "Default Glass UI styling."
  return { title, description: `iOS-style glass ${label} for ${platformLabel}. ${style}` }
}

function buildComponentItem(spec: RegistryItemSpec, withContent: boolean): RegistryItem {
  const base = defaultsForComponent(spec.component)
  const options = spec.preset ? applyPreset(spec.preset, base.text) : base
  const codegen = { component: spec.component, mode: "reusable" as const, platform: spec.platform, options }
  const file: RegistryFile = { path: `registry/glass-ui/${spec.component}.tsx`, type: "registry:ui" }
  if (withContent) file.content = generateCode(codegen)

  return {
    name: spec.name,
    type: "registry:ui",
    ...describe(spec),
    dependencies: getComponentDependencies(spec.platform),
    files: [file],
    categories: ["glass", spec.platform],
    ...(withContent ? { docs: `Usage:\n\n${generateUsageSnippet(codegen, "@/components/ui")}` } : {}),
  }
}

function buildAllItem(baseUrl: string): RegistryItem {
  return {
    name: REGISTRY_ALL_ITEM,
    type: "registry:ui",
    title: "Glass UI · All primitives",
    description: "Every Glass UI web primitive (card, button, input, modal, tab bar, switch, navbar) with default styling.",
    registryDependencies: ALL_COMPONENTS.map((c) => registryItemUrl(c, baseUrl)),
    categories: ["glass", "web"],
  }
}

/** Full item JSON (with file content) served at `<baseUrl>/<name>.json`. */
export function getRegistryItem(name: string, baseUrl = GLASS_UI_REGISTRY_URL): RegistryItem | undefined {
  if (name === REGISTRY_ALL_ITEM) return { $schema: REGISTRY_ITEM_SCHEMA, ...buildAllItem(baseUrl) }
  const spec = listRegistryItemSpecs().find((s) => s.name === name)
  return spec ? { $schema: REGISTRY_ITEM_SCHEMA, ...buildComponentItem(spec, true) } : undefined
}

/** Registry index served at `<baseUrl>/registry.json` (items without file content). */
export function buildRegistry(baseUrl = GLASS_UI_REGISTRY_URL, homepage = GLASS_UI_HOMEPAGE): Registry {
  return {
    $schema: REGISTRY_SCHEMA,
    name: "glass-ui",
    homepage,
    items: [buildAllItem(baseUrl), ...listRegistryItemSpecs().map((spec) => buildComponentItem(spec, false))],
  }
}

/** Every name that has an item JSON (for static generation). */
export function listRegistryItemNames(): string[] {
  return [REGISTRY_ALL_ITEM, ...listRegistryItemSpecs().map((s) => s.name)]
}
