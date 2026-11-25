import { getGlassButtonClasses } from "../variants.js"
import type { GlassOptions } from "../types.js"
import { escapeJsxText } from "./_shared.js"

/**
 * Inline export — <button> snippet with all Tailwind classes applied.
 */
export function renderGlassButtonInline(options: GlassOptions): string {
  const classes = getGlassButtonClasses(options).trim().replace(/\s+/g, " ")
  const label = escapeJsxText(options.text || "Continue")

  return `// 👇 Paste this anywhere in your React component.
export function Example() {
  return (
    <button type="button" className="${classes}">
      ${label}
    </button>
  )
}
`
}
