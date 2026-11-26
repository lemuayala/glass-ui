"use client"

import { Layers, Palette, Wand2 } from "lucide-react"
import { useT } from "@/lib/i18n/provider"
import { CountUp } from "./count-up"
import { Reveal, RevealWords } from "./reveal"
import { ALL_COMPONENTS, PRESETS, listRegistryItemNames } from "@/lib/glass-core/registry"

/** Every primitive × inline/reusable × web/native — the codegen matrix. */
const CODE_VARIANTS = ALL_COMPONENTS.length * 2 * 2

export function LandingSteps() {
  const t = useT()

  const steps = [
    { Icon: Palette, title: t("landing.step1.title"), desc: t("landing.step1.desc") },
    { Icon: Layers, title: t("landing.step2.title"), desc: t("landing.step2.desc") },
    { Icon: Wand2, title: t("landing.step3.title"), desc: t("landing.step3.desc") },
  ]

  const stats = [
    { value: ALL_COMPONENTS.length, label: t("landing.stat.components") },
    { value: PRESETS.length, label: t("landing.stat.presets") },
    { value: CODE_VARIANTS, label: t("landing.stat.templates") },
    { value: listRegistryItemNames().length, label: t("landing.stat.registry") },
  ]

  return (
    <section
      id="steps"
      className="relative mx-auto mt-32 w-full max-w-6xl scroll-mt-24 px-6 md:mt-48"
    >
      <div className="mx-auto max-w-3xl text-center">
        <Reveal
          as="span"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground"
        >
          {t("landing.steps.eyebrow")}
        </Reveal>
        <RevealWords
          text={t("landing.steps.title")}
          className="mt-5 text-balance text-3xl font-bold leading-[1.05] tracking-[-0.02em] text-foreground sm:text-4xl md:text-5xl"
        />
      </div>

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {steps.map(({ Icon, title, desc }, i) => (
          <Reveal
            key={title}
            delay={1 + i}
            data-step
            className="gg-glass gg-glass-inset group relative overflow-hidden rounded-3xl p-7"
          >
            <div className="pointer-events-none absolute -right-12 -top-12 hidden h-32 w-32 rounded-full bg-gradient-to-br from-primary/30 to-pink-400/0 blur-3xl md:block opacity-50 transition-opacity duration-500 group-hover:opacity-90" />
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
          </Reveal>
        ))}
      </div>

      <Reveal
        id="steps-stats"
        className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-foreground/[0.03] md:grid-cols-4"
      >
        {stats.map((s) => (
          <div key={s.label} className="bg-background/40 px-6 py-8 text-center max-md:backdrop-blur-none md:backdrop-blur-md">
            <p className="font-mono text-4xl font-bold tracking-tight text-foreground tabular-nums sm:text-5xl">
              <CountUp value={s.value} />
            </p>
            <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {s.label}
            </p>
          </div>
        ))}
      </Reveal>
    </section>
  )
}
