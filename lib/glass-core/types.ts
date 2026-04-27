/**
 * Shared types for the Glass UI generator.
 * These power the live preview, the CVA variants and the codegen.
 *
 * Future packages will live under `@glass-ui/*` (see README).
 */

export type GlassTheme = "light" | "dark"
export type GlassBlur = "none" | "sm" | "md" | "lg" | "xl"
export type GlassRounded = "none" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full"
export type GlassIntensity = "subtle" | "medium" | "strong"
export type GlassBorder = "none" | "subtle" | "strong"
export type GlassPadding = "sm" | "md" | "lg"
export type GlassShadow = "none" | "sm" | "md" | "lg"
export type GlassSize = "sm" | "md" | "lg"

export type ExportMode = "inline" | "reusable"

export type ComponentKind = "glass-card" | "glass-button" | "glass-input"

export interface GlassOptions {
  theme: GlassTheme
  blur: GlassBlur
  rounded: GlassRounded
  intensity: GlassIntensity
  border: GlassBorder
  padding: GlassPadding
  shadow: GlassShadow
  /** Optional sample text used in the preview (label / placeholder / title). */
  text?: string
}

export interface CodegenInput {
  component: ComponentKind
  mode: ExportMode
  options: GlassOptions
}
