"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { Header, ComponentSwitcherMobile } from "./header"
import { Controls, defaultsFor } from "./controls"
import { Preview } from "./preview"
import { CodePanel } from "./code-panel"
import { ShortcutsDialog } from "./shortcuts-dialog"
import {
  PlaygroundMobileTabs,
  PlaygroundSideTabs,
  playgroundPanelClass,
  type PlaygroundMobilePanel,
  type PlaygroundSidePanel,
} from "./playground-mobile-tabs"
import type { WallpaperId } from "./wallpaper"
import { generateCode, generateUsageSnippet } from "@/lib/glass-core/codegen"
import { generateGlassPrompt, generateShortGlassPrompt } from "@/lib/glass-core/integration-prompt"
import type { ComponentKind, ExportMode, GlassOptions, NativeBlurMode, Platform } from "@/lib/glass-core/types"
import {
  type SerializedState,
  encodeState,
  readInitialState,
  useStateSync,
  PLAYGROUND_PATH,
} from "./use-url-state"
import { useProjectProfile } from "@/hooks/use-project-profile"
import { applyPreset, findMatchingPreset, type GlassPreset } from "@/lib/glass-core/presets"
import { useShortcuts } from "./use-shortcuts"
import { useI18n, useT } from "@/lib/i18n/provider"
import { SiteFooterCredit } from "./site-footer-credit"
import { SITE } from "@/lib/config"
import { cn } from "@/lib/utils"

const COMPONENTS_BY_INDEX: ComponentKind[] = [
  "glass-card",
  "glass-button",
  "glass-input",
  "glass-modal",
  "glass-tabbar",
  "glass-switch",
  "glass-navbar",
]

const FALLBACK_STATE: SerializedState = {
  component: "glass-card",
  mode: "reusable",
  platform: "web",
  nativeBlur: "expo-blur",
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
  const [platform, setPlatform] = useState<Platform>(FALLBACK_STATE.platform)
  const [nativeBlur, setNativeBlur] = useState<NativeBlurMode>(FALLBACK_STATE.nativeBlur)
  const [options, setOptions] = useState<GlassOptions>(FALLBACK_STATE.options)
  const [wallpaper, setWallpaper] = useState<WallpaperId>(FALLBACK_STATE.wallpaper)
  const [customWallpaper, setCustomWallpaper] = useState<string | null>(null)
  const [presetsOpen, setPresetsOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [mobilePanel, setMobilePanel] = useState<PlaygroundMobilePanel>("preview")
  const [sidePanel, setSidePanel] = useState<PlaygroundSidePanel>("controls")
  const { profile, updateProfile } = useProjectProfile()

  // Hydrate once on client from URL > localStorage > fallback.
  useEffect(() => {
    const initial = readInitialState(FALLBACK_STATE)
    setComponent(initial.component)
    setMode(initial.mode)
    setPlatform(initial.platform)
    setNativeBlur(initial.nativeBlur)
    setOptions(initial.options)
    setWallpaper(initial.wallpaper)
    setCustomWallpaper(initial.customWallpaper)
    setHydrated(true)
  }, [])

  const state: SerializedState = useMemo(
    () => ({ component, mode, platform, nativeBlur, options, wallpaper, customWallpaper }),
    [component, mode, platform, nativeBlur, options, wallpaper, customWallpaper],
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

  const codegenInput = useMemo(
    () => ({ component, mode, platform, nativeBlur, options }),
    [component, mode, platform, nativeBlur, options],
  )

  const code = useMemo(() => generateCode(codegenInput), [codegenInput])
  const usageSnippet = useMemo(
    () => generateUsageSnippet(codegenInput, profile.componentPath),
    [codegenInput, profile.componentPath],
  )
  const activePreset = useMemo(() => findMatchingPreset(options), [options])

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return ""
    return `${window.location.origin}${PLAYGROUND_PATH}?${encodeState(state)}`
  }, [state])

  const glassPrompt = useMemo(
    () =>
      generateGlassPrompt({
        codegen: codegenInput,
        profile,
        shareUrl: shareUrl || undefined,
        presetName: activePreset?.name,
      }),
    [codegenInput, profile, shareUrl, activePreset],
  )

  const shortGlassPrompt = useMemo(
    () => generateShortGlassPrompt({ codegen: codegenInput, profile }),
    [codegenInput, profile],
  )

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
    <div className="flex h-dvh max-h-dvh flex-col overflow-hidden">
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

      {/* Main grid — tabs on mobile, preview + one side panel on mid widths (lg), 3 columns from xl */}
      <main className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-6 lg:gap-4">
        <div className="mx-auto grid min-h-0 w-full max-w-[1600px] flex-1 grid-cols-1 gap-3 max-lg:flex max-lg:flex-col max-lg:gap-2 lg:grid-cols-[340px_minmax(0,1fr)] lg:grid-rows-[auto_minmax(0,1fr)] lg:gap-4 xl:grid-cols-[280px_minmax(0,1fr)_480px] xl:grid-rows-[minmax(0,1fr)] 2xl:grid-cols-[300px_minmax(0,1.1fr)_560px]">
          <div className="order-1 shrink-0 lg:hidden">
            <PlaygroundMobileTabs active={mobilePanel} onChange={setMobilePanel} />
          </div>
          <div className="hidden lg:col-start-1 lg:row-start-1 lg:block xl:hidden">
            <PlaygroundSideTabs active={sidePanel} onChange={setSidePanel} />
          </div>

          <section
            id="playground-preview"
            aria-label={t("panel.preview")}
            className={cn(
              "gg-glass gg-glass-inset gg-playground-panel order-2 rounded-2xl max-lg:min-h-[min(52dvh,100%)] max-lg:flex-1 lg:col-start-2 lg:row-span-2 lg:row-start-1 xl:row-span-1",
              playgroundPanelClass("preview", mobilePanel, sidePanel),
            )}
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
            aria-label={t("panel.properties")}
            className={cn(
              "gg-glass gg-glass-inset gg-playground-panel order-2 rounded-2xl lg:col-start-1 lg:row-start-2 xl:row-start-1",
              playgroundPanelClass("controls", mobilePanel, sidePanel),
            )}
          >
            <Controls
              component={component}
              options={options}
              onChange={setOptions}
              profile={profile}
              onProfileChange={updateProfile}
            />
          </section>

          <section
            aria-label={t("panel.code")}
            className={cn(
              "gg-glass gg-glass-inset gg-playground-panel order-2 rounded-2xl lg:col-start-1 lg:row-start-2 xl:col-start-3 xl:row-start-1",
              playgroundPanelClass("code", mobilePanel, sidePanel),
            )}
          >
            <CodePanel
              code={code}
              usageSnippet={usageSnippet}
              glassPrompt={glassPrompt}
              shortGlassPrompt={shortGlassPrompt}
              component={component}
              mode={mode}
              onMode={setMode}
              platform={platform}
              onPlatform={setPlatform}
              nativeBlur={nativeBlur}
              onNativeBlur={setNativeBlur}
            />
          </section>

          <div className="order-3 shrink-0 lg:hidden">
            <ComponentSwitcherMobile component={component} onComponent={handleComponent} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="hidden shrink-0 border-t border-border px-4 py-3 sm:px-6 sm:py-4 lg:block">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-2 sm:flex-row">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <p className="text-[11px] text-muted-foreground">{t("footer.text")}</p>
            <SiteFooterCredit className="text-center sm:text-left" />
          </div>
          <p className="font-mono text-[11px] text-muted-foreground">@glass-ui · v{SITE.version}</p>
        </div>
      </footer>

      <ShortcutsDialog open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  )
}
