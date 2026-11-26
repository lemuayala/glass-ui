"use client"

import { useCallback, useRef } from "react"
import { Music2 } from "lucide-react"
import { useT } from "@/lib/i18n/provider"
import { isLandingLiteViewport } from "@/lib/mobile-landing"
import { segment } from "@/lib/scroll-progress"
import { ScrollScene } from "./scroll-scene"
import { Wallpaper } from "./wallpaper"

/** Scroll ranges of the scene (0 → 1 over the pinned section). Mirrored in the `.gg-zoom-*` CSS. */
const ZOOM_END = 0.38
const BLUR_START = 0.42
const BLUR_END = 0.74
const MAX_BLUR_PX = 28

const BLUR_STEPS: Array<[number, string]> = [
  [0, "none"],
  [4, "sm"],
  [12, "md"],
  [16, "lg"],
  [24, "xl"],
]

function blurToken(px: number): string {
  let token = "none"
  for (const [min, name] of BLUR_STEPS) if (px >= min) token = name
  return token
}

/**
 * Signature scene: a window that starts filling the screen pulls back (zoom out), then the card in the middle
 * turns into frosted glass as you scroll, with the live blur value, and finally the glass tokens pop around it.
 * Transforms + one backdrop-filter; on lite viewports the blur rests at its final value (see docs/PERF-MOBILE.md).
 */
export function LandingGlassZoom() {
  const t = useT()
  const readoutRef = useRef<HTMLSpanElement | null>(null)
  const tokenRef = useRef<HTMLSpanElement | null>(null)

  const onProgress = useCallback((p: number) => {
    // Lite (mobile) rests the blur at its final value, so the readout does too.
    const lite = isLandingLiteViewport()
    const px = lite ? MAX_BLUR_PX : Math.round(segment(p, BLUR_START, BLUR_END) * MAX_BLUR_PX)
    if (readoutRef.current) readoutRef.current.textContent = `${px}px`
    if (tokenRef.current) tokenRef.current.textContent = blurToken(px)
  }, [])

  const chips = [
    { k: t("landing.zoom.chip.blur"), v: "xl · 24px", at: 0.78, place: "gg-zoom-chip-a" },
    { k: t("landing.zoom.chip.tint"), v: "blue", at: 0.82, place: "gg-zoom-chip-b" },
    { k: t("landing.zoom.chip.radius"), v: "3xl", at: 0.86, place: "gg-zoom-chip-c" },
    { k: t("landing.zoom.chip.border"), v: "subtle", at: 0.9, place: "gg-zoom-chip-d" },
  ]

  return (
    <ScrollScene
      mode="sticky"
      as="section"
      id="glass"
      labelledBy="glass-zoom-title"
      className="gg-zoom-scene relative"
      onProgress={onProgress}
      style={
        {
          "--zoom-end": ZOOM_END,
          "--blur-start": BLUR_START,
          "--blur-end": BLUR_END,
          "--blur-max": `${MAX_BLUR_PX}px`,
        } as React.CSSProperties
      }
    >
      <div className="gg-zoom-pin">
        <div className="gg-zoom-title mx-auto max-w-3xl px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {t("landing.zoom.eyebrow")}
          </span>
          <h2
            id="glass-zoom-title"
            className="mt-4 text-balance text-3xl font-bold leading-[1.05] tracking-[-0.02em] text-foreground sm:text-4xl md:text-5xl"
          >
            {t("landing.zoom.title")}
          </h2>
        </div>

        <div className="gg-zoom-stage">
          <div className="gg-zoom-window">
            <Wallpaper id="aurora" />
            {/* Shapes behind the glass so the blur is visible (a smooth gradient looks the same blurred). */}
            <div aria-hidden className="gg-zoom-shapes">
              <span className="gg-zoom-shape gg-zoom-shape-1" />
              <span className="gg-zoom-shape gg-zoom-shape-2" />
              <span className="gg-zoom-shape gg-zoom-shape-3" />
              <span className="gg-zoom-word">GLASS</span>
            </div>

            <div className="gg-zoom-card" role="img" aria-label={t("landing.zoom.cardLabel")}>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20">
                  <Music2 className="h-5 w-5 text-white" strokeWidth={2.2} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">Midnight City</p>
                  <p className="truncate text-xs text-white/70">M83 · Hurry Up, We&apos;re Dreaming</p>
                </div>
              </div>
              <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/20">
                <div className="h-full w-2/5 rounded-full bg-white/90" />
              </div>
              <div className="mt-5 flex items-center justify-between gap-3 whitespace-nowrap font-mono text-[11px] text-white/80">
                <span>backdrop-blur</span>
                <span className="tabular-nums">
                  <span ref={tokenRef}>xl</span> · <span ref={readoutRef}>{MAX_BLUR_PX}px</span>
                </span>
              </div>
            </div>
          </div>

          {chips.map(({ k, v, at, place }) => (
            <div
              key={k}
              aria-hidden
              className={`gg-zoom-chip ${place}`}
              style={{ "--t": at } as React.CSSProperties}
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{k}</span>
              <span className="font-mono text-sm font-semibold text-foreground">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </ScrollScene>
  )
}
