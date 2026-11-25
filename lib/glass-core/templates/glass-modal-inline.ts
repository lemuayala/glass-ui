import { getGlassModalClasses } from "../variants"
import type { GlassOptions } from "../types"
import { escapeJsxText } from "./_shared"

export function renderGlassModalInline(options: GlassOptions): string {
  const classes = getGlassModalClasses(options).trim().replace(/\s+/g, " ")
  const textColor = options.theme === "dark" ? "text-white" : "text-neutral-900"
  const textMuted = options.theme === "dark" ? "text-white/70" : "text-neutral-700"
  const title = escapeJsxText(options.text || "Confirm action")

  return `// 👇 Paste this anywhere in your React component.
export function Example() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="w-full max-w-md ${classes}">
        <h2 className="text-xl font-bold ${textColor}">${title}</h2>
        <p className="mt-2 text-sm ${textMuted}">This action can be undone from settings.</p>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" className="h-9 rounded-full px-4 text-xs font-medium ${textMuted} hover:bg-white/10">Cancel</button>
          <button type="button" className="h-9 rounded-full bg-white/20 px-4 text-xs font-semibold ${textColor}">Confirm</button>
        </div>
      </div>
    </div>
  )
}
`
}
