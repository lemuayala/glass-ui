"use client"

import { useEffect, useRef } from "react"
import { stagger, utils } from "animejs"
import {
  Bell,
  ChevronLeft,
  Compass,
  Heart,
  Home,
  Music,
  Pause,
  Search,
  SkipBack,
  SkipForward,
  Sparkles,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { IPHONE_17_PRO_MAX } from "@/lib/device-frame"
import {
  getGlassButtonClasses,
  getGlassCardClasses,
  getGlassInputClasses,
  getGlassModalClasses,
  getGlassNavbarClasses,
  getGlassSwitchClasses,
  getGlassTabBarClasses,
} from "@/lib/glass-core/variants"
import type { GlassOptions } from "@/lib/glass-core/types"
import {
  createEnterScene,
  prefersReducedMotion,
  revealVisible,
  setRevealPending,
} from "@/lib/landing-motion"
import { useT } from "@/lib/i18n/provider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Wallpaper } from "@/components/glass/wallpaper"
import { IosBattery, IosCellular, IosWifi } from "@/components/glass/ios-icons"

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
const modal: GlassOptions = { ...DARK, padding: "lg", rounded: "3xl" }
const tabbar: GlassOptions = { ...DARK, rounded: "full" }
const switchOpts: GlassOptions = { ...DARK, rounded: "full", tint: "blue", intensity: "strong" }
const navbar: GlassOptions = { ...DARK, rounded: "2xl" }

const TILE_KEYS = [
  "nav.navbar",
  "nav.card",
  "nav.input",
  "nav.button",
  "nav.switch",
  "nav.modal",
  "nav.tabbar",
] as const

/**
 * Premium showcase — iPhone shell; enter-on-scroll reveal like the rest of the landing.
 */
export function LandingShowcase() {
  const t = useT()
  const sectionRef = useRef<HTMLElement | null>(null)
  const copyRef = useRef<HTMLDivElement | null>(null)
  const phoneRef = useRef<HTMLDivElement | null>(null)
  const deviceRef = useRef<HTMLDivElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    const copy = copyRef.current
    const phone = phoneRef.current
    const device = deviceRef.current
    const stage = stageRef.current
    if (!section || !copy || !phone || !stage) return

    const env = stage.querySelector<HTMLElement>("[data-showcase-env]")
    const tiles = Array.from(stage.querySelectorAll<HTMLElement>("[data-showcase-tile]"))
    if (!tiles.length) return

    const lockAll = () => {
      revealVisible([copy, phone, env, ...tiles].filter(Boolean))
    }

    const onBuilt = () => {
      lockAll()
      device?.classList.add("gg-showcase-live")
    }

    if (prefersReducedMotion()) {
      onBuilt()
      return
    }

    setRevealPending(copy, 24)
    utils.set(phone, { opacity: 0, scale: 0.96, translateY: 36, filter: "blur(12px)" })
    if (env) utils.set(env, { opacity: 0, scale: 1.02, filter: "blur(8px)" })
    utils.set(tiles, { opacity: 0, translateY: 24, scale: 0.94, filter: "blur(8px)" })

    const scene = createEnterScene(section, {
      lockTargets: lockAll,
      onComplete: onBuilt,
    })

    scene
      .add(
        copy,
        {
          opacity: [0, 1],
          translateY: [24, 0],
          filter: ["blur(8px)", "blur(0px)"],
          duration: 800,
          ease: "out(4)",
        },
        0,
      )
      .add(
        phone,
        {
          opacity: [0, 1],
          scale: [0.96, 1],
          translateY: [36, 0],
          filter: ["blur(12px)", "blur(0px)"],
          duration: 1000,
          ease: "out(4)",
        },
        120,
      )

    if (env) {
      scene.add(
        env,
        {
          opacity: [0, 1],
          scale: [1.02, 1],
          filter: ["blur(8px)", "blur(0px)"],
          duration: 600,
          ease: "out(3)",
        },
        220,
      )
    }

    scene.add(
      tiles,
      {
        opacity: [0, 1],
        translateY: [24, 0],
        scale: [0.94, 1],
        filter: ["blur(8px)", "blur(0px)"],
        delay: stagger(85, { start: 0 }),
        duration: 720,
        ease: "out(4)",
      },
      300,
    )

    return () => {
      device?.classList.remove("gg-showcase-live")
      scene.revert?.()
    }
  }, [])

  return (
    <section
      id="primitives"
      ref={sectionRef}
      className="relative mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-16 md:py-24"
    >
      <div ref={copyRef} className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {t("landing.showcase.eyebrow")}
          </span>
          <h2 className="mt-5 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
            {t("landing.showcase.title")}
          </h2>
          <p className="mt-4 text-balance text-sm leading-relaxed text-muted-foreground md:text-base">
            {t("landing.showcase.desc")}
          </p>
        </div>

      <TooltipProvider delayDuration={280}>
        <div ref={phoneRef} className="relative mx-auto mt-12 flex flex-col items-center md:mt-16">
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/80">
              {t("landing.showcase.deviceLabel")}
            </p>

            <div
              aria-hidden
              className="pointer-events-none absolute top-24 -z-10 h-[956px] w-[440px] max-w-full rounded-[3.5rem] bg-[radial-gradient(circle_at_50%_35%,_oklch(0.65_0.2_250_/_0.32),_transparent_72%)] blur-3xl"
            />

            <div className="gg-device-scale-wrap">
              <div
                ref={deviceRef}
                className={cn(
                  "gg-device-iphone-pro-max gg-showcase-device relative overflow-hidden",
                  "rounded-[3rem] border-[4px] border-neutral-950 bg-black",
                  "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06),0_32px_64px_-20px_rgba(0,0,0,0.8)]",
                )}
              >
                <Wallpaper id="aurora" className="gg-showcase-wallpaper" />

                <div className="absolute left-1/2 top-3 z-50 flex h-7 w-[84px] -translate-x-1/2 items-center justify-end rounded-full bg-black px-2.5 shadow-[inset_0_0_2px_rgba(255,255,255,0.12)]">
                  <div className="h-2 w-2 rounded-full bg-white/10" />
                </div>

                <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex h-12 items-end justify-between px-7 pb-1 text-[11px] font-semibold text-white/95">
                  <span className="tabular-nums">9:41</span>
                  <div className="flex items-center gap-1.5">
                    <IosCellular className="h-3 w-3" />
                    <IosWifi className="h-3 w-3" />
                    <IosBattery className="h-4 w-4" />
                  </div>
                </div>

                <div
                  ref={stageRef}
                  className="relative flex h-full flex-col pt-12"
                  style={{ paddingBottom: IPHONE_17_PRO_MAX.height * 0.034 }}
                >
                  <div
                    data-showcase-env
                    className="pointer-events-none absolute inset-x-5 top-[3.25rem] bottom-28 z-0"
                    aria-hidden
                  >
                    <div className="mt-2 h-7 w-[36%] rounded-lg bg-white/[0.05]" />
                    <div className="mt-6 space-y-3">
                      {[0.85, 0.7, 0.55].map((w, i) => (
                        <div
                          key={i}
                          className="h-11 rounded-xl bg-white/[0.035]"
                          style={{ width: `${w * 100}%`, marginLeft: i === 1 ? "8%" : 0 }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="relative z-10 flex min-h-0 flex-1 flex-col px-5">
                    {/* 1 — Navigation */}
                    <Tile labelKey={TILE_KEYS[0]} className="shrink-0">
                      <header className={cn(getGlassNavbarClasses(navbar), "w-full")}>
                        <span className="flex items-center gap-0.5 text-xs font-medium text-white/70">
                          <ChevronLeft className="h-3.5 w-3.5" />
                          {t("landing.showcase.back")}
                        </span>
                        <h3 className="text-sm font-semibold text-white">{t("landing.showcase.appName")}</h3>
                        <span className="text-xs font-medium text-primary/90">{t("landing.showcase.done")}</span>
                      </header>
                    </Tile>

                    <div className="mt-4 flex min-h-0 flex-1 flex-col gap-4">
                      {/* 2 — Hero player */}
                      <div>
                        <p className="mb-2 px-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40">
                          {t("landing.showcase.sectionNow")}
                        </p>
                        <Tile labelKey={TILE_KEYS[1]}>
                          <div className={cn(getGlassCardClasses(card), "w-full")}>
                            <div className="flex items-start gap-3">
                              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
                                <Music className="h-5 w-5 text-white" />
                                <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-black/40" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-white">Aurora — Side B</p>
                                <p className="mt-0.5 text-[11px] text-white/55">Glass UI · Live mix</p>
                              </div>
                              <Bell className="h-3.5 w-3.5 shrink-0 text-white/55" />
                            </div>
                            <div className="mt-3.5 h-1 overflow-hidden rounded-full bg-white/15">
                              <div className="gg-showcase-progress h-full w-[38%] rounded-full bg-white/85" />
                            </div>
                            <div className="mt-2.5 flex items-center justify-between text-white/70">
                              <span className="text-[9px] tabular-nums">0:42</span>
                              <div className="flex items-center gap-2.5">
                                <SkipBack className="h-3.5 w-3.5" strokeWidth={2.2} />
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                                  <Pause className="h-3.5 w-3.5 fill-white text-white" />
                                </div>
                                <SkipForward className="h-3.5 w-3.5" strokeWidth={2.2} />
                              </div>
                              <span className="text-[9px] tabular-nums">3:18</span>
                            </div>
                          </div>
                        </Tile>
                      </div>

                      {/* 3–4 — Quick actions */}
                      <div>
                        <p className="mb-2 px-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40">
                          {t("landing.showcase.sectionActions")}
                        </p>
                        <div className="flex flex-col gap-2.5">
                          <Tile labelKey={TILE_KEYS[2]}>
                            <div className={cn(getGlassInputClasses(input), "flex h-11 w-full items-center gap-2")}>
                              <Search className="h-4 w-4 shrink-0 text-white/55" />
                              <span className="text-sm text-white/50">{t("landing.showcase.search")}</span>
                            </div>
                          </Tile>
                          <Tile labelKey={TILE_KEYS[3]}>
                            <div
                              className={cn(
                                getGlassButtonClasses(button),
                                "flex h-11 w-full items-center justify-center text-sm font-medium",
                              )}
                            >
                              <Sparkles className="mr-2 h-4 w-4" strokeWidth={2.5} />
                              {t("landing.showcase.continue")}
                            </div>
                          </Tile>
                        </div>
                      </div>

                      {/* 5 — Settings */}
                      <div>
                        <p className="mb-2 px-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40">
                          {t("landing.showcase.sectionPrefs")}
                        </p>
                        <Tile labelKey={TILE_KEYS[4]}>
                          <div className="flex w-full items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-3">
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-white/90">{t("landing.showcase.liveActivities")}</p>
                              <p className="text-[10px] text-white/50">{t("landing.showcase.liveActivitiesDesc")}</p>
                            </div>
                            <div className={cn(getGlassSwitchClasses(switchOpts), "h-8 w-14 shrink-0 px-0.5")}>
                              <span className="block h-6 w-6 translate-x-6 rounded-full bg-white shadow-sm" />
                            </div>
                          </div>
                        </Tile>
                      </div>

                      {/* 6 — Modal (in flow, above tab bar) */}
                      <div className="mt-auto">
                        <p className="mb-2 px-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40">
                          {t("landing.showcase.sectionPrompt")}
                        </p>
                        <Tile labelKey={TILE_KEYS[5]}>
                          <div className={cn(getGlassModalClasses(modal), "w-full")}>
                            <p className="text-[15px] font-semibold text-white">{t("landing.showcase.modalTitle")}</p>
                            <p className="mt-1.5 text-[12px] leading-relaxed text-white/65">
                              {t("landing.showcase.modalDesc")}
                            </p>
                            <div className="mt-4 flex gap-2">
                              <button
                                type="button"
                                className="flex-1 rounded-xl bg-white/10 py-2.5 text-xs font-medium text-white/80"
                              >
                                {t("landing.showcase.modalCancel")}
                              </button>
                              <button
                                type="button"
                                className="flex-1 rounded-xl bg-primary/90 py-2.5 text-xs font-semibold text-white"
                              >
                                {t("landing.showcase.modalSave")}
                              </button>
                            </div>
                          </div>
                        </Tile>
                      </div>
                    </div>

                    {/* 7 — Tab bar dock */}
                    <Tile labelKey={TILE_KEYS[6]} className="mt-3 shrink-0 pb-1">
                      <nav className={cn(getGlassTabBarClasses(tabbar), "w-full")}>
                        {[
                          { Icon: Home, label: "Home", active: true },
                          { Icon: Search, label: "Search", active: false },
                          { Icon: Heart, label: "Saved", active: false },
                          { Icon: Compass, label: "Maps", active: false },
                          { Icon: User, label: "Me", active: false },
                        ].map(({ Icon, label, active }) => (
                          <div key={label} className="flex flex-1 flex-col items-center gap-0.5 py-0.5">
                            <Icon
                              className={cn("h-4 w-4", active ? "text-white" : "text-white/50")}
                              strokeWidth={2.2}
                            />
                            <span
                              className={cn("text-[9px] font-medium", active ? "text-white" : "text-white/50")}
                            >
                              {label}
                            </span>
                          </div>
                        ))}
                      </nav>
                    </Tile>
                  </div>
                </div>

                <div className="pointer-events-none absolute bottom-2 left-1/2 z-40 h-1 w-[108px] -translate-x-1/2 rounded-full bg-white/30" />
              </div>
            </div>
          </div>
      </TooltipProvider>
    </section>
  )
}

export function LandingMarquee() {
  const items = [
    "Glass Card",
    "Glass Button",
    "Glass Input",
    "Glass Modal",
    "Glass Tab Bar",
    "Glass Switch",
    "Glass Navigation Bar",
    "GLASS.md",
    "Tailwind CSS",
    "CVA Variants",
    "iOS Glass",
    "Backdrop Blur",
  ]
  return (
    <div className="relative w-full overflow-hidden py-8 [mask-image:linear-gradient(to_right,transparent,#000_15%,#000_85%,transparent)]">
      <div className="gg-marquee flex w-max items-center gap-3">
        {[...items, ...items].map((label, i) => (
          <span
            key={`${label}-${i}`}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/[0.08] bg-foreground/[0.03] px-4 py-2 text-[12px] font-medium uppercase tracking-wider text-muted-foreground backdrop-blur-md"
          >
            <span className="inline-block h-1 w-1 rounded-full bg-primary/70" />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

function Tile({
  children,
  className,
  labelKey,
}: {
  children: React.ReactNode
  className?: string
  labelKey: (typeof TILE_KEYS)[number]
}) {
  const t = useT()
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          data-showcase-tile
          className={cn(
            "relative w-full will-change-transform outline-none transition-shadow duration-300",
            "hover:z-40 hover:ring-1 hover:ring-white/25",
            className,
          )}
        >
          {children}
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={10} className="capitalize">
        {t(labelKey)}
      </TooltipContent>
    </Tooltip>
  )
}
