import type { GlassOptions } from "../types"

export function renderGlassModalInline(options: GlassOptions): string {
  return `// 👇 Paste this anywhere in your React component.
export function Example() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-black/60 p-8 shadow-2xl backdrop-blur-xl">
        <h2 className="text-xl font-bold text-white">Glass Modal</h2>
        <p className="mt-2 text-white/70">This is a premium glassmorphic modal.</p>
      </div>
    </div>
  )
}
`
}
