import type { GlassOptions } from "../types"

export function renderGlassTabBarInline(options: GlassOptions): string {
  return `// 👇 Paste this anywhere in your React component.
export function Example() {
  return (
    <nav className="flex h-16 w-full max-w-sm items-center justify-around overflow-hidden rounded-full border border-white/20 bg-black/40 px-6 shadow-lg backdrop-blur-xl">
      <div className="h-6 w-6 rounded-full bg-white/20" />
      <div className="h-6 w-6 rounded-full bg-white/20" />
      <div className="h-6 w-6 rounded-full bg-white/20" />
      <div className="h-6 w-6 rounded-full bg-white/20" />
    </nav>
  )
}
`
}
