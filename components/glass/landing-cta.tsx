"use client"

import { useEffect, useRef } from "react"
import { splitText, stagger } from "animejs"
import { ArrowRight, Sparkles } from "lucide-react"
import { useT } from "@/lib/i18n/provider"
import { createEnterScene, prefersReducedMotion, revealVisible, setRevealPending } from "@/lib/landing-motion"
import { SiriCtaLink } from "./siri-cta-link"

export function LandingCta() {
  const t = useT()
  const sectionRef = useRef<HTMLElement | null>(null)
  const innerRef = useRef<HTMLDivElement | null>(null)
  const eyebrowRef = useRef<HTMLSpanElement | null>(null)
  const titleRef = useRef<HTMLHeadingElement | null>(null)
  const subRef = useRef<HTMLParagraphElement | null>(null)
  const ctaRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    const inner = innerRef.current
    const eyebrow = eyebrowRef.current
    const title = titleRef.current
    const sub = subRef.current
    const cta = ctaRef.current
    if (!section || !inner || !eyebrow || !title || !sub || !cta) return

    const titleSplit = splitText(title, { words: { wrap: "clip" } })
    const targets = [eyebrow, titleSplit.words, sub, cta]

    if (prefersReducedMotion()) {
      revealVisible(targets)
      return () => titleSplit.revert?.()
    }

    setRevealPending(targets, 24)

    const scene = createEnterScene(section, {
      lockTargets: () => targets,
    })

    scene
      .add(eyebrow, { opacity: [0, 1], translateY: [16, 0], duration: 500 }, 0)
      .add(
        titleSplit.words,
        {
          opacity: [0, 1],
          translateY: [28, 0],
          filter: ["blur(10px)", "blur(0px)"],
          delay: stagger(60),
          duration: 700,
        },
        80,
      )
      .add(
        sub,
        {
          opacity: [0, 1],
          translateY: [20, 0],
          filter: ["blur(8px)", "blur(0px)"],
          duration: 600,
        },
        280,
      )
      .add(
        cta,
        {
          opacity: [0, 1],
          translateY: [20, 0],
          scale: [0.97, 1],
          filter: ["blur(8px)", "blur(0px)"],
          duration: 600,
        },
        400,
      )

    return () => {
      scene.revert?.()
      titleSplit.revert?.()
    }
  }, [t])

  return (
    <section
      ref={sectionRef}
      className="relative mx-auto mt-32 w-full max-w-5xl scroll-mt-8 px-6 pb-24 md:mt-48 md:pb-32"
    >
      <div
        ref={innerRef}
        className="relative overflow-visible rounded-[2.5rem] border border-white/[0.08] bg-foreground/[0.03] px-6 py-20 text-center backdrop-blur-xl"
      >
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_oklch(0.7_0.18_250_/_0.35),_transparent_70%)] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -right-10 h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,_oklch(0.75_0.18_340_/_0.25),_transparent_70%)] blur-3xl" />

        <div className="relative">
          <span
            ref={eyebrowRef}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground"
          >
            <Sparkles className="h-3 w-3 text-primary" />
            {t("landing.cta.eyebrow")}
          </span>
          <h2
            ref={titleRef}
            className="mx-auto mt-6 max-w-2xl text-balance text-4xl font-bold leading-[1.05] tracking-[-0.025em] text-foreground sm:text-5xl md:text-6xl"
          >
            {t("landing.cta.title")}
          </h2>
          <p
            ref={subRef}
            className="mx-auto mt-6 max-w-xl text-balance text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            {t("landing.cta.desc")}
          </p>
          <div ref={ctaRef} className="mt-10">
            <SiriCtaLink href="/play">
              <Sparkles
                className="h-4 w-4 transition-transform duration-500 group-hover:rotate-12"
                strokeWidth={2.5}
              />
              <span>{t("landing.cta.play")}</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </SiriCtaLink>
          </div>
        </div>
      </div>
    </section>
  )
}
