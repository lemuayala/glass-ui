import { getGlassTabBarClasses } from "../variants.js"
import type { GlassOptions } from "../types.js"

export function renderGlassTabBarInline(options: GlassOptions): string {
  const classes = getGlassTabBarClasses(options).trim().replace(/\s+/g, " ")
  const isDark = options.theme === "dark"
  const iconActive = isDark ? "bg-white" : "bg-neutral-900"
  const iconMuted = isDark ? "bg-white/30" : "bg-black/20"
  const textActive = isDark ? "text-white" : "text-neutral-900"
  const textMuted = isDark ? "text-white/55" : "text-neutral-700/60"

  return `// 👇 Paste this anywhere in your React component.
export function Example() {
  return (
    <nav className="w-full max-w-sm ${classes}">
      <button type="button" className="flex flex-col items-center gap-0.5">
        <span className="h-5 w-5 rounded-full ${iconActive}" />
        <span className="text-[10px] font-medium ${textActive}">Home</span>
      </button>
      <button type="button" className="flex flex-col items-center gap-0.5">
        <span className="h-5 w-5 rounded-full ${iconMuted}" />
        <span className="text-[10px] font-medium ${textMuted}">Search</span>
      </button>
      <button type="button" className="flex flex-col items-center gap-0.5">
        <span className="h-5 w-5 rounded-full ${iconMuted}" />
        <span className="text-[10px] font-medium ${textMuted}">Profile</span>
      </button>
    </nav>
  )
}
`
}
