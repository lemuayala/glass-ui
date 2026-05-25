"use client"

import type { Ref } from "react"
import Link from "next/link"
import { ArrowRight, Music, Search, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  getGlassButtonClasses,
  getGlassCardClasses,
  getGlassInputClasses,
} from "@/lib/glass-core/variants"
import type { GlassOptions } from "@/lib/glass-core/types"
import { useT } from "@/lib/i18n/provider"

const DARK: GlassOptions = {
  theme: "dark",
  blur: "xl",
  rounded: "3xl",
  intensity: "medium",
  border: "subtle",
  padding: "md",
  shadow: "lg",
  tint: "none",
}

const card: GlassOptions = { ...DARK, rounded: "2xl" }
const button: GlassOptions = { ...DARK, rounded: "full", tint: "blue", intensity: "strong" }
const input: GlassOptions = { ...DARK, rounded: "xl" }

const SAMPLE_KEYS = ["nav.card", "nav.input", "nav.button"] as const

export function LandingShowcaseMobile({ deviceRef }: { deviceRef?: Ref<HTMLDivElement> }) {
  const t = useT()

  return (
    <div className="mx-auto mt-10 w-full max-w-md">
      <div
        ref={deviceRef}
        data-showcase-device
        className={cn(
          "gg-showcase-device relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-neutral-950 p-5 shadow-xl",
          "bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,oklch(0.55_0.18_265_/_0.35),transparent_55%)]",
        )}
      >
        <div
          data-showcase-env
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,oklch(0.62_0.2_265_/_0.2),transparent_65%)]"
        />

        <p className="relative mb-4 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
          {t("landing.showcase.deviceLabel")}
        </p>

        <div className="relative space-y-3">
          <div data-showcase-tile>
            <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wider text-white/40">
              {t(SAMPLE_KEYS[0])}
            </p>
            <div className={cn(getGlassCardClasses(card), "w-full")}>
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                  <Music className="h-5 w-5 text-white" />
                  <span
                    className="gg-live-dot absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-black/40"
                    aria-hidden
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">Aurora — Side B</p>
                  <p className="text-[11px] text-white/55">Glass UI · Live mix</p>
                </div>
              </div>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/15">
                <div className="gg-showcase-progress h-full w-[38%] rounded-full bg-white/85" />
              </div>
            </div>
          </div>

          <div data-showcase-tile>
            <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wider text-white/40">
              {t(SAMPLE_KEYS[1])}
            </p>
            <div className={cn(getGlassInputClasses(input), "flex h-11 w-full items-center gap-2")}>
              <Search className="h-4 w-4 text-white/55" />
              <span className="text-sm text-white/50">{t("landing.showcase.search")}</span>
            </div>
          </div>

          <div data-showcase-tile>
            <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wider text-white/40">
              {t(SAMPLE_KEYS[2])}
            </p>
            <div
              className={cn(
                getGlassButtonClasses(button),
                "flex h-11 w-full items-center justify-center text-sm font-medium",
              )}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {t("landing.showcase.continue")}
            </div>
          </div>
        </div>

        <p className="relative mt-5 text-center text-xs leading-relaxed text-white/55">
          {t("landing.showcase.mobileMore")}
        </p>
      </div>

      <Link
        href="/play"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
      >
        {t("landing.showcase.mobileCta")}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}
