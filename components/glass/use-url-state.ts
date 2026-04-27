"use client"

import { useCallback, useEffect, useRef } from "react"
import type { ComponentKind, ExportMode, GlassOptions, GlassTint } from "@/lib/glass-core/types"
import type { WallpaperId } from "./wallpaper"

/**
 * State <-> URL search params (compact keys) <-> localStorage.
 *
 * URL is the source of truth when present (shareable). Otherwise we hydrate
 * from localStorage on first mount. Updates are debounced via rAF to avoid
 * thrashing the history stack while the user drags sliders.
 *
 * Compact key map:
 *   c   component       (card | button | input | modal | tabbar)
 *   m   export mode     (inline | reusable)
 *   t   theme           (light | dark)
 *   b   blur            (none|sm|md|lg|xl)
 *   r   rounded         (none|md|lg|xl|2xl|3xl|full)
 *   i   intensity       (subtle|medium|strong)
 *   bd  border          (none|subtle|strong)
 *   p   padding         (sm|md|lg)
 *   sh  shadow          (none|sm|md|lg)
 *   tn  tint            (none|blue|pink|orange|teal)
 *   txt text            (URL-encoded)
 *   w   wallpaper       (id)
 */

export interface SerializedState {
  component: ComponentKind
  mode: ExportMode
  options: GlassOptions
  wallpaper: WallpaperId
}

const STORAGE_KEY = "glass-ui-state-v1"

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
  return { component, mode, options, wallpaper }
}

/** Sync the current state into the URL + localStorage (debounced via rAF). */
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
  const fromUrl = window.location.search
  if (fromUrl && new URLSearchParams(fromUrl).has("c")) {
    return decodeState(fromUrl, fallback)
  }
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored) return decodeState(`?${stored}`, fallback)
  } catch {
    /* ignore */
  }
  return fallback
}

/** Build a shareable absolute URL for the current state. */
export function useShareUrl() {
  return useCallback((state: SerializedState) => {
    if (typeof window === "undefined") return ""
    return `${window.location.origin}${window.location.pathname}?${encodeState(state)}`
  }, [])
}
