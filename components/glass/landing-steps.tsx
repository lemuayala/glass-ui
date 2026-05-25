"use client"

import { useEffect, useRef } from "react"
import { splitText, stagger, utils } from "animejs"
import { Layers, Palette, Wand2 } from "lucide-react"
import { useT } from "@/lib/i18n/provider"
import {
  animateStatCounters,
  createEnterScene,
  prefersReducedMotion,
  revealVisible,
  setRevealPending,
} from "@/lib/landing-motion"
import { isLandingLiteViewport } from "@/lib/mobile-landing"

export function LandingSteps() {
  const t = useT()
  const sectionRef = useRef<HTMLElement | null>(null)
  const titleRef = useRef<HTMLHeadingElement | null>(null)
  const stepsRef = useRef<HTMLDivElement | null>(null)
  const statsRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    const title = titleRef.current
    const steps = stepsRef.current
    const stats = statsRef.current
    if (!section || !title || !steps || !stats) return

    const cards = steps.querySelectorAll<HTMLElement>("[data-step]")
    const counters = stats.querySelectorAll<HTMLElement>("[data-counter]")
    const statLabels = stats.querySelectorAll<HTMLElement>("p:not([data-counter])")
    const lite = isLandingLiteViewport()

    if (prefersReducedMotion()) {
      revealVisible([title, cards, counters, statLabels])
      animateStatCounters(counters)
      return
    }

    if (lite) {
      setRevealPending([title], 20)
      utils.set(cards, { opacity: 0, translateY: 22, scale: 0.99 })
      utils.set(counters, { opacity: 0, translateY: 8 })
      utils.set(statLabels, { opacity: 0 })

      const scene = createEnterScene(section, {
        anchor: () => titleRef.current,
        lockTargets: () => [title, cards],
      })
      scene
        .add(title, { opacity: [0, 1], translateY: [18, 0], duration: 420 }, 0)
        .add(
          cards,
          {
            opacity: [0, 1],
            translateY: [22, 0],
            scale: [0.99, 1],
            delay: stagger(55, { start: 0 }),
            duration: 480,
          },
          100,
        )

      const statsEl = stats
      const statsScene = createEnterScene(statsEl, {
        anchor: () => statsEl,
        lockTargets: () => [counters, statLabels],
        onComplete: () => animateStatCounters(counters),
      })
      statsScene.add(
        [counters, statLabels],
        {
          opacity: [0, 1],
          translateY: [8, 0],
          delay: stagger(40, { start: 0 }),
          duration: 380,
        },
        0,
      )

      scene.armReveal()
      statsScene.armReveal()
      return () => {
        scene.revert?.()
        statsScene.revert?.()
      }
    }

    const titleSplit = splitText(title, { words: { wrap: "clip" } })

    setRevealPending(titleSplit.words, 28)
    utils.set(cards, { opacity: 0, translateY: 32, scale: 0.98 })
    utils.set(counters, { opacity: 0, translateY: 10 })
    utils.set(statLabels, { opacity: 0 })

    const scene = createEnterScene(section, {
      anchor: () => titleRef.current,
      lockTargets: () => [titleSplit.words, cards],
    })

    scene
      .add(
        titleSplit.words,
        {
          opacity: [0, 1],
          translateY: [24, 0],
          delay: stagger(50),
          duration: 600,
        },
        0,
      )
      .add(
        cards,
        {
          opacity: [0, 1],
          translateY: [32, 0],
          scale: [0.98, 1],
          delay: stagger(90, { start: 0 }),
          duration: 650,
        },
        120,
      )

    const statsEl = stats
    const statsScene = createEnterScene(statsEl, {
      anchor: () => statsEl,
      lockTargets: () => [counters, statLabels],
      onComplete: () => animateStatCounters(counters),
    })

    statsScene.add(
      [counters, statLabels],
      {
        opacity: [0, 1],
        translateY: [10, 0],
        delay: stagger(60, { start: 0 }),
        duration: 450,
      },
      0,
    )

    scene.armReveal()
    statsScene.armReveal()

    return () => {
      scene.revert?.()
      statsScene.revert?.()
      titleSplit.revert?.()
    }
  }, [t])

  const steps = [
    { Icon: Palette, title: t("landing.step1.title"), desc: t("landing.step1.desc") },
    { Icon: Layers, title: t("landing.step2.title"), desc: t("landing.step2.desc") },
    { Icon: Wand2, title: t("landing.step3.title"), desc: t("landing.step3.desc") },
  ]

  const stats = [
    { value: 7, suffix: "", label: t("landing.stat.components") },
    { value: 28, suffix: "", label: t("landing.stat.templates") },
    { value: 4, suffix: "", label: t("landing.stat.exports") },
        { value: 8, suffix: "", label: t("landing.stat.controls") },
  ]

  return (
    <section
      id="steps"
      ref={sectionRef}
      className="relative mx-auto mt-32 w-full max-w-6xl scroll-mt-24 px-6 md:mt-48"
    >
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {t("landing.steps.eyebrow")}
        </span>
        <h2
          ref={titleRef}
          className="mt-5 text-balance text-3xl font-bold leading-[1.05] tracking-[-0.02em] text-foreground sm:text-4xl md:text-5xl"
        >
          {t("landing.steps.title")}
        </h2>
      </div>

      <div ref={stepsRef} className="mt-14 grid gap-5 md:grid-cols-3">
        {steps.map(({ Icon, title, desc }, i) => (
          <div
            key={title}
            data-step
            className="gg-glass gg-glass-inset group relative overflow-hidden rounded-3xl p-7"
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-primary/30 to-pink-400/0 blur-3xl opacity-50 transition-opacity duration-500 group-hover:opacity-90" />
            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-foreground/15 to-foreground/[0.04] shadow-[inset_0_1px_0_0_var(--gg-glass-inset-light)]">
                  <Icon className="h-4 w-4 text-foreground" strokeWidth={2.2} />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div
        id="steps-stats"
        ref={statsRef}
        className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-foreground/[0.03] md:grid-cols-4"
      >
        {stats.map((s) => (
          <div key={s.label} className="bg-background/40 px-6 py-8 text-center max-md:backdrop-blur-none md:backdrop-blur-md">
            <p
              data-counter={s.value}
              data-suffix={s.suffix}
              className="font-mono text-4xl font-bold tracking-tight text-foreground tabular-nums sm:text-5xl"
            >
              0
            </p>
            <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
