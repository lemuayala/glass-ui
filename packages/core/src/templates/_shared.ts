/**
 * Shared snippets injected into reusable templates so we keep one source
 * of truth for things like tint variants & compounds.
 *
 * These are *strings* (code) that get interpolated into the generated
 * component file. They are NOT used at runtime by the playground itself —
 * the playground uses the typed versions in `../variants.ts`.
 */

import type { GlassBlur } from "../types.js"

export const BLUR_INTENSITY_MAP: Record<GlassBlur, number> = {
  none: 0,
  sm: 20,
  md: 45,
  lg: 70,
  xl: 95,
}

export const BLUR_INTENSITY_SNIPPET = `const BLUR_INTENSITY = {
  none: 0,
  sm: 20,
  md: 45,
  lg: 70,
  xl: 95,
} as const`

export function stripBackdropBlur(classes: string): string {
  return classes
    .split(/\s+/)
    .filter((token) => token && !token.startsWith("backdrop-blur"))
    .join(" ")
}

export const TINT_VARIANT_SNIPPET = `tint: {
        none: "",
        blue: "",
        pink: "",
        orange: "",
        teal: "",
      }`

export const TINT_COMPOUNDS_SNIPPET = `      { tint: "blue", intensity: "subtle", className: "bg-blue-500/15" },
      { tint: "blue", intensity: "medium", className: "bg-blue-500/25" },
      { tint: "blue", intensity: "strong", className: "bg-blue-500/40" },
      { tint: "pink", intensity: "subtle", className: "bg-pink-500/15" },
      { tint: "pink", intensity: "medium", className: "bg-pink-500/25" },
      { tint: "pink", intensity: "strong", className: "bg-pink-500/40" },
      { tint: "orange", intensity: "subtle", className: "bg-orange-500/20" },
      { tint: "orange", intensity: "medium", className: "bg-orange-500/30" },
      { tint: "orange", intensity: "strong", className: "bg-orange-500/45" },
      { tint: "teal", intensity: "subtle", className: "bg-teal-500/15" },
      { tint: "teal", intensity: "medium", className: "bg-teal-500/25" },
      { tint: "teal", intensity: "strong", className: "bg-teal-500/40" },`

/**
 * Safely serialize user text inside JSX children (`<tag>${escapeJsxText(s)}</tag>`).
 * Plain text stays readable; strings with `{`, `}`, `<`, `>`, or newlines become `{JSON.stringify(s)}`.
 */
export function escapeJsxText(value: string): string {
  if (/[\{\}<>\r\n]/.test(value)) {
    return `{${JSON.stringify(value)}}`
  }
  return value
}

/**
 * Safely serialize a string attribute (`placeholder=${escapeJsxAttr(s)}`).
 * Normal strings emit `"..."`; quotes/backslashes/newlines wrap in `{JSON.stringify(s)}` when needed.
 */
export function escapeJsxAttr(value: string): string {
  if (/["\\\r\n]/.test(value)) {
    return `{${JSON.stringify(value)}}`
  }
  return `"${value}"`
}
