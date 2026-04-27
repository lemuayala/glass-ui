"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { Header, ComponentSwitcherMobile } from "./header"
import { Controls, defaultsFor } from "./controls"
import { Preview } from "./preview"
import { CodePanel } from "./code-panel"
import { ShortcutsDialog } from "./shortcuts-dialog"
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
import { useShortcuts } from "./use-shortcuts"
import { useI18n, useT } from "@/lib/i18n/provider"
import { SITE } from "@/lib/config"

const COMPONENTS_BY_INDEX: ComponentKind[] = [
  "glass-card",
  "glass-button",
  "glass-input",
  "glass-modal",
  "glass-tabbar",
]

const FALLBACK_STATE: SerializedState = {
  component: "glass-card",
  mode: "reusable",
  options: defaultsFor("glass-card"),
  wallpaper: "aurora",
  customWallpaper: null,
}

export function Generator() {
  const t = useT()
  const { toggleLocale } = useI18n()
  const { resolvedTheme, setTheme } = useTheme()

  const [hydrated, setHydrated] = useState(false)
  const [component, setComponent] = useState<ComponentKind>(FALLBACK_STATE.component)
  const [mode, setMode] = useState<ExportMode>(FALLBACK_STATE.mode)
  const [options, setOptions] = useState<GlassOptions>(FALLBACK_STATE.options)
  const [wallpaper, setWallpaper] = useState<WallpaperId>(FALLBACK_STATE.wallpaper)
  const [customWallpaper, setCustomWallpaper] = useState<string | null>(null)
  const [presetsOpen, setPresetsOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)

  // Hydrate once on client from URL > localStorage > fallback.
  useEffect(() => {
    const initial = readInitialState(FALLBACK_STATE)
    setComponent(initial.component)
    setMode(initial.mode)
    setOptions(initial.options)
    setWallpaper(initial.wallpaper)
    setCustomWallpaper(initial.customWallpaper)
    setHydrated(true)
  }, [])

  const state: SerializedState = useMemo(
    () => ({ component, mode, options, wallpaper, customWallpaper }),
    [component, mode, options, wallpaper, customWallpaper],
  )

  useStateSync(hydrated ? state : FALLBACK_STATE)

  const handleComponent = useCallback((next: ComponentKind) => {
    setComponent(next)
    setOptions(defaultsFor(next))
  }, [])

  const handleApplyPreset = useCallback((preset: GlassPreset) => {
    setOptions((prev) => applyPreset(preset, prev.text))
  }, [])

  const handleCustomUpload = useCallback((dataUrl: string) => {
    setCustomWallpaper(dataUrl)
    setWallpaper("custom")
  }, [])

  const handleCustomClear = useCallback(() => {
    setCustomWallpaper(null)
    setWallpaper((curr) => (curr === "custom" ? "aurora" : curr))
  }, [])

  const code = useMemo(() => generateCode({ component, mode, options }), [component, mode, options])

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return ""
    return `${window.location.origin}${window.location.pathname}?${encodeState(state)}`
  }, [state])

  const handleShare = useCallback(async () => {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success(t("share.toast.title"), {
        description: t("share.toast.description"),
        action: {
          label: t("share.toast.action"),
          onClick: () => window.open(shareUrl, "_blank"),
        },
      })
    } catch {
      /* ignore */
    }
  }, [shareUrl, t])

  // Wire up keyboard shortcuts
  useShortcuts({
    onComponentByIndex: (i) => {
      const next = COMPONENTS_BY_INDEX[i]
      if (next) handleComponent(next)
    },
    onToggleComponentTheme: () =>
      setOptions((curr) => ({ ...curr, theme: curr.theme === "dark" ? "light" : "dark" })),
    onTogglePresets: () => setPresetsOpen((s) => !s),
    onShare: handleShare,
    onToggleLocale: toggleLocale,
    onToggleAppTheme: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
    onShowHelp: () => setShortcutsOpen((s) => !s),
  })

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        component={component}
        onComponent={handleComponent}
        options={options}
        onApplyPreset={handleApplyPreset}
        shareUrl={shareUrl}
        presetsOpen={presetsOpen}
        onPresetsOpenChange={setPresetsOpen}
        onShowShortcuts={() => setShortcutsOpen(true)}
      />

      {/* Mobile-only component switcher under the header */}
      <div className="border-b border-border bg-background/40 px-4 py-3 lg:hidden">
        <ComponentSwitcherMobile component={component} onComponent={handleComponent} />
      </div>

      {/* Main grid — 3 columns on desktop, stack on mobile */}
      <main className="flex-1 px-4 py-4 md:px-6 md:py-6">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-4 lg:h-[calc(100vh-8rem)] lg:grid-cols-[300px_1fr_minmax(380px,520px)]">
          <section
            aria-label={t("panel.properties")}
            className="gg-glass gg-glass-inset overflow-hidden rounded-2xl max-lg:max-h-[60vh]"
          >
            <Controls component={component} options={options} onChange={setOptions} />
          </section>

          <section
            aria-label={t("panel.preview")}
            className="gg-glass gg-glass-inset overflow-hidden rounded-2xl max-lg:h-[70vh]"
          >
            <Preview
              component={component}
              options={options}
              wallpaper={wallpaper}
              customWallpaper={customWallpaper}
              onWallpaper={setWallpaper}
              onCustomUpload={handleCustomUpload}
              onCustomClear={handleCustomClear}
            />
          </section>

          <section
            aria-label={t("panel.code")}
            className="gg-glass gg-glass-inset overflow-hidden rounded-2xl max-lg:h-[70vh]"
          >
            <CodePanel code={code} mode={mode} onMode={setMode} />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-4">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-2 text-[11px] text-muted-foreground sm:flex-row">
          <p>{t("footer.text")}</p>
          <p className="font-mono">@glass-ui · v{SITE.version}</p>
        </div>
      </footer>

      <ShortcutsDialog open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  )
}
