"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Header, ComponentSwitcherMobile } from "./header"
import { Controls, defaultsFor } from "./controls"
import { Preview } from "./preview"
import { CodePanel } from "./code-panel"
import type { WallpaperId } from "./wallpaper"
import { generateCode } from "@/lib/glass-core/codegen"
import type { ComponentKind, ExportMode, GlassOptions } from "@/lib/glass-core/types"
import {
  type SerializedState,
  encodeState,
  readInitialState,
  useStateSync,
} from "./use-url-state"
import { applyPreset, type GlassPreset } from "@/lib/glass-core/presets"

const FALLBACK_STATE: SerializedState = {
  component: "glass-card",
  mode: "reusable",
  options: defaultsFor("glass-card"),
  wallpaper: "aurora",
}

export function Generator() {
  const [hydrated, setHydrated] = useState(false)
  const [component, setComponent] = useState<ComponentKind>(FALLBACK_STATE.component)
  const [mode, setMode] = useState<ExportMode>(FALLBACK_STATE.mode)
  const [options, setOptions] = useState<GlassOptions>(FALLBACK_STATE.options)
  const [wallpaper, setWallpaper] = useState<WallpaperId>(FALLBACK_STATE.wallpaper)

  // Hydrate once on client from URL > localStorage > fallback.
  useEffect(() => {
    const initial = readInitialState(FALLBACK_STATE)
    setComponent(initial.component)
    setMode(initial.mode)
    setOptions(initial.options)
    setWallpaper(initial.wallpaper)
    setHydrated(true)
  }, [])

  const state: SerializedState = useMemo(
    () => ({ component, mode, options, wallpaper }),
    [component, mode, options, wallpaper],
  )

  // Persist state -> URL + localStorage (skipped during the very first render
  // so we don't overwrite an inbound shareable URL with the SSR fallback).
  useStateSync(hydrated ? state : FALLBACK_STATE)

  const handleComponent = useCallback((next: ComponentKind) => {
    setComponent(next)
    setOptions(defaultsFor(next))
  }, [])

  const handleApplyPreset = useCallback(
    (preset: GlassPreset) => {
      setOptions((prev) => applyPreset(preset, prev.text))
    },
    [],
  )

  const code = useMemo(() => generateCode({ component, mode, options }), [component, mode, options])

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return ""
    return `${window.location.origin}${window.location.pathname}?${encodeState(state)}`
  }, [state])

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        component={component}
        onComponent={handleComponent}
        options={options}
        onApplyPreset={handleApplyPreset}
        shareUrl={shareUrl}
      />

      {/* Mobile-only component switcher under the header */}
      <div className="border-b border-white/5 bg-background/40 px-4 py-3 lg:hidden">
        <ComponentSwitcherMobile component={component} onComponent={handleComponent} />
      </div>

      {/* Main grid — 3 columns on desktop, stack on mobile */}
      <main className="flex-1 px-4 py-4 md:px-6 md:py-6">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-4 lg:h-[calc(100vh-8rem)] lg:grid-cols-[300px_1fr_minmax(380px,520px)]">
          {/* Controls */}
          <section
            aria-label="Properties"
            className="gg-glass gg-glass-inset overflow-hidden rounded-2xl max-lg:max-h-[60vh]"
          >
            <Controls component={component} options={options} onChange={setOptions} />
          </section>

          {/* Preview */}
          <section
            aria-label="Live preview"
            className="gg-glass gg-glass-inset overflow-hidden rounded-2xl max-lg:h-[70vh]"
          >
            <Preview
              component={component}
              options={options}
              wallpaper={wallpaper}
              onWallpaper={setWallpaper}
            />
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
          <p className="font-mono">@glass-ui · v0.2.0</p>
        </div>
      </footer>
    </div>
  )
}
