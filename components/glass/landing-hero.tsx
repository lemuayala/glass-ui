"use client"

import { useEffect, useRef } from "react"
import { animate, createTimeline, splitText, stagger, utils } from "animejs"
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react"
import { useT } from "@/lib/i18n/provider"
import { revealVisible } from "@/lib/landing-motion"
import { SiriCtaLink } from "./siri-cta-link"

export function LandingHero() {
  const t = useT()
  const titleRef = useRef<HTMLHeadingElement | null>(null)
  const subRef = useRef<HTMLParagraphElement | null>(null)
  const badgeRef = useRef<HTMLSpanElement | null>(null)
  const ctaRef = useRef<HTMLDivElement | null>(null)
  const tickerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const title = titleRef.current
    const sub = subRef.current
    const badge = badgeRef.current
    const cta = ctaRef.current
    const ticker = tickerRef.current
    if (!title || !sub || !badge || !cta || !ticker) return

    /* Split title by words to avoid spacing bugs and animate each word */
    const titleSplit = splitText(title, { words: { wrap: "clip" }, chars: true })
    utils.set([badge, sub, cta, ticker], { opacity: 0, translateY: 18, filter: "blur(6px)" })
    utils.set(titleSplit.chars, { opacity: 0, translateY: 42, filter: "blur(10px)" })

    const tl = createTimeline({
      defaults: { ease: "out(4)" },
      onComplete: () => {
        revealVisible([badge, sub, cta, ticker, titleSplit.chars])
      },
    })
      .add(badge, { opacity: [0, 1], translateY: [10, 0], filter: ["blur(6px)", "blur(0px)"], duration: 600 }, 0)
      .add(
        titleSplit.chars,
        {
          opacity: [0, 1],
          translateY: [50, 0],
          filter: ["blur(12px)", "blur(0px)"],
          duration: 1100,
          delay: stagger(18),
        },
        100,
      )
      .add(
        sub,
        { opacity: [0, 1], translateY: [20, 0], filter: ["blur(6px)", "blur(0px)"], duration: 800 },
        "-=500",
      )
      .add(
        cta,
        {
          opacity: [0, 1],
          translateY: [20, 0],
          scale: [0.94, 1],
          filter: ["blur(6px)", "blur(0px)"],
          duration: 900,
        },
        "-=400",
      )
      .add(ticker, { opacity: [0, 1], filter: ["blur(6px)", "blur(0px)"], duration: 600 }, "-=200")

    return () => {
      tl.revert?.()
      titleSplit.revert?.()
    }
  }, [t])

  const scrollToPrimitives = () => {
    document.querySelector("#primitives")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section
      id="inicio"
      className="relative mx-auto flex min-h-[calc(100dvh-4.25rem)] w-full max-w-6xl flex-col items-center justify-center px-6 py-16 text-center md:py-20"
    >
      {/* Badge */}
      <span
        ref={badgeRef}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground backdrop-blur-md"
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-60" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-primary" />
        </span>
        {t("landing.badge")}
      </span>

      {/* Hero title — splitText handles spacing/wrapping perfectly */}
      <h1
        ref={titleRef}
        className="mt-7 max-w-[18ch] text-balance text-5xl font-bold leading-[1] tracking-[-0.03em] text-foreground sm:text-6xl md:max-w-[14ch] md:text-7xl md:leading-[0.95] lg:text-[88px]"
      >
        {t("landing.headline")}
      </h1>

      {/* Subhead */}
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

      {/* Live — end of “inicio”; primitivos on scroll */}
      <div
        ref={tickerRef}
        className="mt-10 inline-flex items-center gap-2 text-[11px] text-muted-foreground/70"
      >
        <span className="inline-block h-1 w-1 rounded-full bg-emerald-400" />
        <span className="font-mono uppercase tracking-wider">{t("landing.live")}</span>
      </div>

      <button
        type="button"
        onClick={scrollToPrimitives}
        className="mt-10 inline-flex flex-col items-center gap-1.5 text-muted-foreground/80 transition-colors hover:text-foreground"
        aria-label={t("landing.scrollHint")}
      >
        <ChevronDown className="h-4 w-4 animate-bounce" strokeWidth={2.2} />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em]">{t("landing.scrollHint")}</span>
      </button>
    </section>
  )
}
