import { renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"
import {
  decodeState,
  encodeState,
  readInitialState,
  useShareUrl,
  type SerializedState,
} from "./use-url-state"

const fallback: SerializedState = {
  component: "glass-card",
  mode: "reusable",
  platform: "web",
  options: {
    theme: "dark",
    blur: "lg",
    rounded: "2xl",
    intensity: "medium",
    border: "subtle",
    padding: "md",
    shadow: "md",
    tint: "none",
    text: "",
  },
  wallpaper: "aurora",
  customWallpaper: null,
}

describe("use-url-state encodeState / decodeState / sanitization", () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.history.replaceState(null, "", "/play")
  })

  it("round-trips state including native platform and text", () => {
    const state: SerializedState = {
      ...fallback,
      component: "glass-navbar",
      mode: "inline",
      platform: "native",
      options: {
        ...fallback.options,
        tint: "teal",
        text: "Now Playing",
      },
      wallpaper: "sunset",
    }
    const qs = encodeState(state)
    expect(qs).toContain("pl=native")
    const decoded = decodeState(`?${qs}`, fallback)
    expect(decoded).toEqual(state)
  })

  it("remains backwards-compatible with legacy URLs missing pl param", () => {
    const legacy =
      "?c=switch&m=reusable&t=light&b=xl&r=full&i=subtle&bd=strong&p=lg&sh=sm&tn=blue&w=aurora"
    const decoded = decodeState(legacy, fallback)
    expect(decoded.component).toBe("glass-switch")
    expect(decoded.platform).toBe("web")
    expect(decoded.options.tint).toBe("blue")
  })

  it("rejects invalid/tampered enum params and truncates overly long text", () => {
    const longText = "A".repeat(250)
    const tampered = `?c=unknown&m=hacked&pl=android&t=neon&b=999px&r=octagon&i=ultra&bd=thick&p=xxl&sh=huge&tn=purple&w=mars&txt=${longText}`
    const decoded = decodeState(tampered, fallback)

    expect(decoded.component).toBe(fallback.component)
    expect(decoded.mode).toBe(fallback.mode)
    expect(decoded.platform).toBe(fallback.platform)
    expect(decoded.wallpaper).toBe(fallback.wallpaper)
    expect(decoded.options.theme).toBe(fallback.options.theme)
    expect(decoded.options.blur).toBe(fallback.options.blur)
    expect(decoded.options.rounded).toBe(fallback.options.rounded)
    expect(decoded.options.intensity).toBe(fallback.options.intensity)
    expect(decoded.options.border).toBe(fallback.options.border)
    expect(decoded.options.padding).toBe(fallback.options.padding)
    expect(decoded.options.shadow).toBe(fallback.options.shadow)
    expect(decoded.options.tint).toBe(fallback.options.tint)
    expect(decoded.options.text).toHaveLength(120)
  })

  it("prioritizes URL over localStorage in readInitialState and builds share URLs", () => {
    window.localStorage.setItem("glass-ui-state-v1", encodeState({ ...fallback, component: "glass-input" }))
    expect(readInitialState(fallback).component).toBe("glass-input")

    window.history.replaceState(null, "", `/play?${encodeState({ ...fallback, component: "glass-modal" })}`)
    expect(readInitialState(fallback).component).toBe("glass-modal")

    const { result } = renderHook(() => useShareUrl())
    const url = result.current({ ...fallback, platform: "native" })
    expect(url).toContain("/play?")
    expect(url).toContain("pl=native")
  })
})
