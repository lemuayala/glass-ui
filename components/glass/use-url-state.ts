"use client"

import { useCallback, useEffect, useRef } from "react"
import type {
  ComponentKind,
  ExportMode,
  GlassOptions,
  GlassTint,
  NativeBlurMode,
  Platform,
} from "@/lib/glass-core/types"
import type { WallpaperId } from "./wallpaper"

/**
 * State <-> URL search params (compact keys) <-> localStorage.
 *
 * URL is the source of truth when present (shareable). Otherwise we hydrate
 * from localStorage on first mount. Updates are debounced via rAF.
 *
 * The custom wallpaper image (data URL) lives ONLY in localStorage — it would
 * blow up the URL otherwise. The shareable URL only carries the wallpaper *id*
 * (which can be "custom"); recipients without that custom image fall back to
 * the default wallpaper automatically inside <Wallpaper>.
 */

export interface SerializedState {
  component: ComponentKind
  mode: ExportMode
  platform: Platform
  nativeBlur: NativeBlurMode
  options: GlassOptions
  wallpaper: WallpaperId
  customWallpaper: string | null
}

export const PLAYGROUND_PATH = "/play"

const STORAGE_KEY = "glass-ui-state-v1"
const CUSTOM_WALLPAPER_KEY = "glass-ui-custom-wallpaper-v1"

const COMPONENT_SHORT: Record<ComponentKind, string> = {
  "glass-card": "card",
  "glass-button": "button",
  "glass-input": "input",
  "glass-modal": "modal",
  "glass-tabbar": "tabbar",
  "glass-switch": "switch",
  "glass-navbar": "navbar",
}
const COMPONENT_FROM: Record<string, ComponentKind> = {
  card: "glass-card",
  button: "glass-button",
  input: "glass-input",
  modal: "glass-modal",
  tabbar: "glass-tabbar",
  switch: "glass-switch",
  navbar: "glass-navbar",
}

export function encodeState(state: SerializedState): string {
  const { component, mode, platform, nativeBlur, options, wallpaper } = state
  const params = new URLSearchParams()
  params.set("c", COMPONENT_SHORT[component])
  params.set("m", mode)
  params.set("pl", platform)
  if (platform === "native" || nativeBlur !== "expo-blur") {
    params.set("nb", nativeBlur)
  }
  params.set("t", options.theme)
  params.set("b", options.blur)
  params.set("r", options.rounded)
  params.set("i", options.intensity)
  params.set("bd", options.border)
  params.set("p", options.padding)
  params.set("sh", options.shadow)
  params.set("tn", options.tint)
  if (options.text) params.set("txt", options.text)
  params.set("w", wallpaper)
  return params.toString()
}

const VALID_MODES: readonly ExportMode[] = ["inline", "reusable"]
const VALID_PLATFORMS: readonly Platform[] = ["web", "native"]
const VALID_NATIVE_BLURS: readonly NativeBlurMode[] = ["expo-blur", "nativewind"]
const VALID_THEMES: readonly GlassOptions["theme"][] = ["light", "dark"]
const VALID_BLURS: readonly GlassOptions["blur"][] = ["none", "sm", "md", "lg", "xl"]
const VALID_ROUNDED: readonly GlassOptions["rounded"][] = ["none", "md", "lg", "xl", "2xl", "3xl", "full"]
const VALID_INTENSITIES: readonly GlassOptions["intensity"][] = ["subtle", "medium", "strong"]
const VALID_BORDERS: readonly GlassOptions["border"][] = ["none", "subtle", "strong"]
const VALID_PADDINGS: readonly GlassOptions["padding"][] = ["sm", "md", "lg"]
const VALID_SHADOWS: readonly GlassOptions["shadow"][] = ["none", "sm", "md", "lg"]
const VALID_TINTS: readonly GlassTint[] = ["none", "blue", "pink", "orange", "teal"]
const VALID_WALLPAPERS: readonly WallpaperId[] = ["sunset", "aurora", "ocean", "ember", "mono", "custom"]
const MAX_TEXT_LENGTH = 120

function pickValid<T extends string>(raw: string | null, allowed: readonly T[], fallback: T): T {
  return raw !== null && (allowed as readonly string[]).includes(raw) ? (raw as T) : fallback
}

export function decodeState(search: string, fallback: SerializedState): SerializedState {
  const params = new URLSearchParams(search)
  if (!params.has("c")) return fallback

  const component = COMPONENT_FROM[params.get("c") ?? ""] ?? fallback.component
  const mode = pickValid(params.get("m"), VALID_MODES, fallback.mode)
  const platform = pickValid(params.get("pl"), VALID_PLATFORMS, fallback.platform)
  const nativeBlur = pickValid(params.get("nb"), VALID_NATIVE_BLURS, fallback.nativeBlur)
  const wallpaper = pickValid(params.get("w"), VALID_WALLPAPERS, fallback.wallpaper)
  const rawTxt = params.get("txt")
  const text = rawTxt !== null ? rawTxt.slice(0, MAX_TEXT_LENGTH) : (fallback.options.text ?? "")

  const options: GlassOptions = {
    theme: pickValid(params.get("t"), VALID_THEMES, fallback.options.theme),
    blur: pickValid(params.get("b"), VALID_BLURS, fallback.options.blur),
    rounded: pickValid(params.get("r"), VALID_ROUNDED, fallback.options.rounded),
    intensity: pickValid(params.get("i"), VALID_INTENSITIES, fallback.options.intensity),
    border: pickValid(params.get("bd"), VALID_BORDERS, fallback.options.border),
    padding: pickValid(params.get("p"), VALID_PADDINGS, fallback.options.padding),
    shadow: pickValid(params.get("sh"), VALID_SHADOWS, fallback.options.shadow),
    tint: pickValid(params.get("tn"), VALID_TINTS, fallback.options.tint),
    text,
  }
  return {
    component,
    mode,
    platform,
    nativeBlur,
    options,
    wallpaper,
    customWallpaper: fallback.customWallpaper,
  }
}

/** Sync state to URL + localStorage. Custom wallpaper goes to its own key. */
export function useStateSync(state: SerializedState) {
  const rafRef = useRef<number | null>(null)
  useEffect(() => {
    if (typeof window === "undefined") return
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const qs = encodeState(state)
      const path =
        window.location.pathname === "/" ? PLAYGROUND_PATH : window.location.pathname
      const next = `${path}?${qs}`
      window.history.replaceState(null, "", next)
      try {
        window.localStorage.setItem(STORAGE_KEY, qs)
        if (state.customWallpaper) {
          window.localStorage.setItem(CUSTOM_WALLPAPER_KEY, state.customWallpaper)
        } else {
          window.localStorage.removeItem(CUSTOM_WALLPAPER_KEY)
        }
      } catch {
        /* private mode / quota — ignore */
      }
    })
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [state])
}

/** Read the initial state once: URL > localStorage > fallback. */
export function readInitialState(fallback: SerializedState): SerializedState {
  if (typeof window === "undefined") return fallback

  let customWallpaper: string | null = null
  try {
    customWallpaper = window.localStorage.getItem(CUSTOM_WALLPAPER_KEY)
  } catch {
    /* ignore */
  }
  const baseFallback = { ...fallback, customWallpaper }

  const fromUrl = window.location.search
  if (fromUrl && new URLSearchParams(fromUrl).has("c")) {
    return decodeState(fromUrl, baseFallback)
  }
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored) return decodeState(`?${stored}`, baseFallback)
  } catch {
    /* ignore */
  }
  return baseFallback
}

/** Build a shareable absolute URL for the current state. */
export function useShareUrl() {
  return useCallback((state: SerializedState) => {
    if (typeof window === "undefined") return ""
    const path =
      window.location.pathname === "/" ? PLAYGROUND_PATH : window.location.pathname
    return `${window.location.origin}${path}?${encodeState(state)}`
  }, [])
}
