import { getGlassCardClasses } from "../variants.js"
import type { GlassOptions } from "../types.js"
import { escapeJsxText } from "./_shared.js"

/**
 * Inline export — a single <div> snippet with all Tailwind classes applied.
 */
export function renderGlassCardInline(options: GlassOptions): string {
  const classes = getGlassCardClasses(options).trim().replace(/\s+/g, " ")
  const title = escapeJsxText(options.text || "Glass Card")

  return `// 👇 Paste this anywhere in your React component.
export function Example() {
  return (
    <div className="${classes}">
      <h3 className="text-base font-semibold ${
        options.theme === "dark" ? "text-white" : "text-neutral-900"
      }">
        ${title}
      </h3>
      <p className="mt-1 text-sm ${
        options.theme === "dark" ? "text-white/70" : "text-neutral-700"
      }">
        Frosted glass surface, Tailwind ready.
      </p>
    </div>
  )
}
`
}
