import { getGlassButtonClasses } from "../variants"
import type { GlassOptions } from "../types"

/**
 * Inline export — <button> snippet with all Tailwind classes applied.
 */
export function renderGlassButtonInline(options: GlassOptions): string {
  const classes = getGlassButtonClasses(options).trim().replace(/\s+/g, " ")
  const label = (options.text || "Continue").replace(/"/g, '\\"')

  return `// 👇 Paste this anywhere in your React component.
export function Example() {
  return (
    <button className="${classes}">
      ${label}
    </button>
  )
}
`
}
