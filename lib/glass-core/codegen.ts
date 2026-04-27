import type { CodegenInput } from "./types"
import { renderGlassCardInline } from "./templates/glass-card-inline"
import { renderGlassCardReusable } from "./templates/glass-card-reusable"
import { renderGlassButtonInline } from "./templates/glass-button-inline"
import { renderGlassButtonReusable } from "./templates/glass-button-reusable"
import { renderGlassInputInline } from "./templates/glass-input-inline"
import { renderGlassInputReusable } from "./templates/glass-input-reusable"

/**
 * Single entry-point for code generation.
 * Switch on (component, mode) and dispatch to the right template.
 *
 * Adding a new component (Modal, Toast, NavBar) means:
 *  1. Add it to `ComponentKind` in types.ts
 *  2. Create variants + templates following the GlassCard pattern
 *  3. Add a case here
 */
export function generateCode(input: CodegenInput): string {
  const { component, mode, options } = input

  switch (component) {
    case "glass-card":
      return mode === "inline" ? renderGlassCardInline(options) : renderGlassCardReusable(options)
    case "glass-button":
      return mode === "inline" ? renderGlassButtonInline(options) : renderGlassButtonReusable(options)
    case "glass-input":
      return mode === "inline" ? renderGlassInputInline(options) : renderGlassInputReusable(options)
    default:
      return "// Unsupported component"
  }
}

export * from "./types"
export * from "./variants"
