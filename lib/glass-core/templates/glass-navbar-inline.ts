import { getGlassNavbarClasses } from "../variants"
import type { GlassOptions } from "../types"

export function renderGlassNavbarInline(options: GlassOptions): string {
  const classes = getGlassNavbarClasses(options).trim().replace(/\s+/g, " ")
  const title = (options.text || "Glass UI").replace(/"/g, '\\"')
  const isDark = options.theme === "dark"
  const fg = isDark ? "text-white" : "text-neutral-900"
  const muted = isDark ? "text-white/60" : "text-neutral-600"

  return `// 👇 Paste this anywhere in your React component.
export function Example() {
  return (
    <header className="${classes}">
      <button type="button" className="text-sm font-medium ${muted}">Back</button>
      <h1 className="truncate text-base font-semibold ${fg}">${title}</h1>
      <button type="button" className="text-sm font-medium ${muted}">Done</button>
    </header>
  )
}
`
}
