"use client"

import { useCallback, useEffect, useRef } from "react"
import type { ComponentKind, ExportMode, GlassOptions, GlassTint } from "@/lib/glass-core/types"
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
  options: GlassOptions
  wallpaper: WallpaperId
  customWallpaper: string | null
}

const STORAGE_KEY = "glass-ui-state-v1"
const CUSTOM_WALLPAPER_KEY = "glass-ui-custom-wallpaper-v1"

const COMPONENT_SHORT: Record<ComponentKind, string> = {
  "glass-card": "card",
  "glass-button": "button",
  "glass-input": "input",
  "glass-modal": "modal",
  "glass-tabbar": "tabbar",
}
const COMPONENT_FROM: Record<string, ComponentKind> = {
  card: "glass-card",
  button: "glass-button",
  input: "glass-input",
  modal: "glass-modal",
  tabbar: "glass-tabbar",
}

export function encodeState(state: SerializedState): string {
  const { component, mode, options, wallpaper } = state
  const params = new URLSearchParams()
  params.set("c", COMPONENT_SHORT[component])
  params.set("m", mode)
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

export function decodeState(search: string, fallback: SerializedState): SerializedState {
  const params = new URLSearchParams(search)
  if (!params.has("c")) return fallback

  const component = COMPONENT_FROM[params.get("c") ?? ""] ?? fallback.component
  const mode = (params.get("m") as ExportMode) ?? fallback.mode
  const wallpaper = (params.get("w") as WallpaperId) ?? fallback.wallpaper

  const options: GlassOptions = {
    theme: (params.get("t") as GlassOptions["theme"]) ?? fallback.options.theme,
    blur: (params.get("b") as GlassOptions["blur"]) ?? fallback.options.blur,
    rounded: (params.get("r") as GlassOptions["rounded"]) ?? fallback.options.rounded,
    intensity: (params.get("i") as GlassOptions["intensity"]) ?? fallback.options.intensity,
    border: (params.get("bd") as GlassOptions["border"]) ?? fallback.options.border,
    padding: (params.get("p") as GlassOptions["padding"]) ?? fallback.options.padding,
    shadow: (params.get("sh") as GlassOptions["shadow"]) ?? fallback.options.shadow,
    tint: (params.get("tn") as GlassTint) ?? "none",
    text: params.get("txt") ?? fallback.options.text ?? "",
  }
  return {
    component,
    mode,
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
      const next = `${window.location.pathname}?${qs}`
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
    return `${window.location.origin}${window.location.pathname}?${encodeState(state)}`
  }, [])
}
