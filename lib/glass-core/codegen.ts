import type { CodegenInput } from "./types"
import { renderGlassCardInline } from "./templates/glass-card-inline"
import { renderGlassCardReusable } from "./templates/glass-card-reusable"

/**
 * Single entry-point for code generation.
 * Switch on (component, mode) and dispatch to the right template.
 *
 * Adding a new component (Button, Input, Modal) means:
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
    case "glass-input":
      return `// ${component} — coming soon ✨\n// Follow the GlassCard pattern in lib/glass-core to contribute.`
    default:
      return "// Unsupported component"
  }
}

export * from "./types"
export * from "./variants"
