import { getGlassInputClasses } from "../variants"
import type { GlassOptions } from "../types"
import { escapeJsxAttr } from "./_shared"

/**
 * Inline export — <input> snippet with all Tailwind classes applied.
 */
export function renderGlassInputInline(options: GlassOptions): string {
  const classes = getGlassInputClasses(options).trim().replace(/\s+/g, " ")
  const placeholder = escapeJsxAttr(options.text || "Search…")

  return `// 👇 Paste this anywhere in your React component.
import { useState } from "react"

export function Example() {
  const [value, setValue] = useState("")
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder=${placeholder}
      className="${classes}"
    />
  )
}
`
}
