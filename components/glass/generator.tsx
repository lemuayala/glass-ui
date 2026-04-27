"use client"

import { useMemo, useState } from "react"
import { Header } from "./header"
import { Controls, DEFAULT_OPTIONS } from "./controls"
import { Preview } from "./preview"
import { CodePanel } from "./code-panel"
import type { WallpaperId } from "./wallpaper"
import { generateCode } from "@/lib/glass-core/codegen"
import type { ComponentKind, ExportMode, GlassOptions } from "@/lib/glass-core/types"

export function Generator() {
  const [component, setComponent] = useState<ComponentKind>("glass-card")
  const [mode, setMode] = useState<ExportMode>("reusable")
  const [options, setOptions] = useState<GlassOptions>(DEFAULT_OPTIONS)
  const [wallpaper, setWallpaper] = useState<WallpaperId>("aurora")

  const code = useMemo(() => generateCode({ component, mode, options }), [component, mode, options])

  return (
    <div className="flex min-h-screen flex-col">
      <Header component={component} onComponent={setComponent} />

      {/* Main grid — 3 columns on desktop, stack on mobile */}
      <main className="flex-1 px-4 py-4 md:px-6 md:py-6">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-4 lg:h-[calc(100vh-8rem)] lg:grid-cols-[300px_1fr_minmax(380px,520px)]">
          {/* Controls */}
          <section
            aria-label="Properties"
            className="gg-glass gg-glass-inset overflow-hidden rounded-2xl max-lg:max-h-[60vh]"
          >
            <Controls options={options} onChange={setOptions} />
          </section>

          {/* Preview */}
          <section
            aria-label="Live preview"
            className="gg-glass gg-glass-inset overflow-hidden rounded-2xl max-lg:h-[70vh]"
          >
            <Preview options={options} wallpaper={wallpaper} onWallpaper={setWallpaper} />
          </section>

          {/* Code */}
          <section
            aria-label="Generated code"
            className="gg-glass gg-glass-inset overflow-hidden rounded-2xl max-lg:h-[70vh]"
          >
            <CodePanel code={code} mode={mode} onMode={setMode} />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-4">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-2 text-[11px] text-muted-foreground sm:flex-row">
          <p>
            Built for <span className="font-medium text-foreground">React Native</span> + NativeWind. Tailwind on the
            web works too.
          </p>
          <p className="font-mono">@glass-ui · v0.1.0</p>
        </div>
      </footer>
    </div>
  )
}
