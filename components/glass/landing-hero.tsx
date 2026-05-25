"use client"

import { useEffect, useRef } from "react"
import { createTimeline, splitText, stagger, utils } from "animejs"
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react"
import { useT } from "@/lib/i18n/provider"
import {
  prefersReducedMotion,
  requestLandingSectionReveal,
  revealVisible,
  setRevealPending,
} from "@/lib/landing-motion"
import { isLandingLiteViewport } from "@/lib/mobile-landing"
import { SiriCtaLink } from "./siri-cta-link"
import { LandingParticles } from "./landing-particles"

export function LandingHero() {
  const t = useT()
  const leadRef = useRef<HTMLSpanElement | null>(null)
  const accentRef = useRef<HTMLSpanElement | null>(null)
  const subRef = useRef<HTMLParagraphElement | null>(null)
  const badgeRef = useRef<HTMLSpanElement | null>(null)
  const ctaRef = useRef<HTMLDivElement | null>(null)
  const tickerRef = useRef<HTMLDivElement | null>(null)
  const scrollRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    const lead = leadRef.current
    const accent = accentRef.current
    const sub = subRef.current
    const badge = badgeRef.current
    const cta = ctaRef.current
    const ticker = tickerRef.current
    const scroll = scrollRef.current
    if (!lead || !accent || !sub || !badge || !cta || !ticker || !scroll) return

    const ui = [badge, sub, cta, ticker, scroll] as HTMLElement[]

    /** Accent never goes through splitText — avoids rare disappear on first paint. */
    const showAccent = () => {
      utils.set(accent, { opacity: 1, translateY: 0 })
    }
    showAccent()

    if (prefersReducedMotion()) {
      revealVisible([lead, accent, ...ui])
      return
    }

    if (isLandingLiteViewport()) {
      setRevealPending([lead, accent, ...ui], 14)
      const lock = () => revealVisible([lead, accent, ...ui])
      const tl = createTimeline({
        defaults: { ease: "out(3)" },
        onComplete: lock,
      })
        .add(lead, { opacity: [0, 1], translateY: [18, 0], duration: 480 }, 0)
        .add(accent, { opacity: [0.5, 1], translateY: [10, 0], duration: 420 }, 120)
        .add(badge, { opacity: [0, 1], translateY: [10, 0], duration: 400 }, 80)
        .add(sub, { opacity: [0, 1], translateY: [12, 0], duration: 420 }, 200)
        .add(cta, { opacity: [0, 1], translateY: [12, 0], scale: [0.98, 1], duration: 450 }, 280)
        .add([ticker, scroll], { opacity: [0, 1], translateY: [8, 0], duration: 380 }, 360)
      tl.play()
      const safety = window.setTimeout(lock, 2400)
      return () => {
        window.clearTimeout(safety)
        tl.revert?.()
        lock()
      }
    }

    const leadSplit = splitText(lead, { words: { wrap: "clip" } })
    utils.set(ui, { opacity: 0, translateY: 16 })
    utils.set(leadSplit.words, { opacity: 0, translateY: 28 })

    const lock = () => {
      revealVisible([leadSplit.words, accent, ...ui])
      showAccent()
    }

    const tl = createTimeline({
      defaults: { ease: "out(3)" },
      onComplete: lock,
    })
      .add(badge, { opacity: [0, 1], translateY: [10, 0], duration: 500 }, 0)
      .add(
        leadSplit.words,
        {
          opacity: [0, 1],
          translateY: [28, 0],
          duration: 700,
          delay: stagger(45),
        },
        80,
      )
      .add(accent, { opacity: [0.4, 1], translateY: [12, 0], duration: 550 }, 320)
      .add(sub, { opacity: [0, 1], translateY: [16, 0], duration: 550 }, "-=280")
      .add(cta, { opacity: [0, 1], translateY: [14, 0], scale: [0.97, 1], duration: 600 }, "-=300")
      .add([ticker, scroll], { opacity: [0, 1], translateY: [10, 0], duration: 450 }, "-=250")

    const safety = window.setTimeout(lock, 2200)

    return () => {
      window.clearTimeout(safety)
      tl.revert?.()
      leadSplit.revert?.()
      lock()
    }
  }, [t])

  const scrollToPrimitives = () => {
    const target = document.querySelector("#primitives")
    if (!target) return
    const reduced = prefersReducedMotion()
    target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" })

    let revealed = false
    const nudgeReveal = () => {
      if (revealed) return
      revealed = true
      requestLandingSectionReveal("primitives")
    }
    if (reduced) {
      nudgeReveal()
      return
    }
    window.addEventListener("scrollend", nudgeReveal, { once: true, passive: true })
    window.setTimeout(nudgeReveal, 850)
  }

  return (
    <section
      id="inicio"
      className="relative flex w-full min-h-[calc(100dvh-4.25rem)] flex-col items-center justify-center px-6 py-16 text-center md:py-20"
    >
      {/* Hero luma + magical particles */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-visible">
        <div className="gg-hero-ambient-lite absolute inset-0 md:hidden" aria-hidden />
        <div className="absolute inset-0 hidden overflow-visible md:block" aria-hidden>
          <LandingParticles />
          <div className="gg-inicio-beam absolute left-1/2 top-[12%] h-[min(520px,70vh)] w-[min(100vw,900px)] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,_oklch(0.62_0.22_265_/_0.4),_transparent_68%)] blur-3xl" />
          <div className="gg-inicio-beam gg-inicio-beam-2 absolute -left-[10%] top-[38%] h-[min(320px,45vh)] w-[min(55vw,420px)] rounded-full bg-[radial-gradient(circle,_oklch(0.72_0.2_320_/_0.34),_transparent_70%)] blur-3xl" />
          <div className="gg-inicio-beam gg-inicio-beam-3 absolute -right-[8%] top-[22%] h-[min(360px,48vh)] w-[min(50vw,400px)] rounded-full bg-[radial-gradient(circle,_oklch(0.75_0.18_195_/_0.28),_transparent_70%)] blur-3xl" />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center">
        <span
          ref={badgeRef}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground max-md:backdrop-blur-none md:backdrop-blur-md"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-60 max-md:hidden" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          {t("landing.badge")}
        </span>

        <h1 className="mt-7 max-w-[20ch] text-balance text-5xl font-bold leading-[1.02] tracking-[-0.03em] text-foreground sm:text-6xl md:max-w-[16ch] md:text-7xl md:leading-[0.95] lg:text-[88px]">
          <span ref={leadRef}>{t("landing.headlineLead")}</span>{" "}
          <span ref={accentRef} data-headline-accent className="gg-text-accent">
            {t("landing.headlineAccent")}
          </span>
        </h1>

        <p
          ref={subRef}
          className="mt-7 max-w-xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl"
        >
          {t("landing.subhead")}
        </p>

        <div ref={ctaRef} className="mt-12">
          <SiriCtaLink href="/play">
            <Sparkles
              className="h-4 w-4 transition-transform duration-500 group-hover:rotate-12"
              strokeWidth={2.5}
            />
            <span>{t("landing.cta.play")}</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </SiriCtaLink>
        </div>

        <div
          ref={tickerRef}
          className="mt-10 inline-flex items-center gap-2 text-[11px] text-muted-foreground/80"
        >
          <span
            className="gg-live-dot inline-block h-1.5 w-1.5 rounded-full bg-emerald-400"
            aria-hidden
          />
          <span className="font-mono uppercase tracking-wider">{t("landing.live")}</span>
        </div>

        <button
          ref={scrollRef}
          type="button"
          onClick={scrollToPrimitives}
          className="mt-10 inline-flex flex-col items-center gap-1.5 text-muted-foreground/80 transition-colors hover:text-foreground"
          aria-label={t("landing.scrollHint")}
        >
          <ChevronDown className="h-4 w-4 max-md:animate-none md:animate-bounce" strokeWidth={2.2} />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em]">{t("landing.scrollHint")}</span>
        </button>
      </div>
    </section>
  )
}
