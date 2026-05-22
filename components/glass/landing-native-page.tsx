"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import { Github, Smartphone, Sparkles } from "lucide-react"
import { useT, useI18n } from "@/lib/i18n/provider"
import { GITHUB_REPO_URL, SITE } from "@/lib/config"
import { BrandLogo } from "./brand-logo"
import { SiriCtaLink } from "./siri-cta-link"
import { ScrollToTop } from "./scroll-to-top"
import { createEnterScene, prefersReducedMotion, revealVisible, setRevealPending } from "@/lib/landing-motion"
import { stagger, splitText, utils } from "animejs"
import { ArrowRight } from "lucide-react"

const NATIVE_SAMPLE = `import { View, Text, Pressable } from "react-native"
import { glassCardVariants } from "@/components/ui/glass-card"
import { cn } from "@/lib/utils"

export function NowPlayingCard() {
  return (
    <View className={cn(glassCardVariants({
      theme: "dark",
      blur: "xl",
      rounded: "2xl",
      intensity: "medium",
    }))}>
      <Text className="text-white font-semibold">
        Aurora — Side B
      </Text>
    </View>
  )
}`

export function LandingNativePage() {
  const t = useT()
  const { locale, toggleLocale } = useI18n()
  const heroRef = useRef<HTMLElement | null>(null)
  const titleRef = useRef<HTMLHeadingElement | null>(null)
  const subRef = useRef<HTMLParagraphElement | null>(null)
  const ctaRef = useRef<HTMLDivElement | null>(null)
  const codeRef = useRef<HTMLPreElement | null>(null)
  const featsRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const section = heroRef.current
    const title = titleRef.current
    const sub = subRef.current
    const cta = ctaRef.current
    const code = codeRef.current
    const feats = featsRef.current
    if (!section || !title || !sub || !cta || !code || !feats) return

    const titleSplit = splitText(title, { words: { wrap: "clip" } })
    const lines = code.querySelectorAll<HTMLElement>("[data-line]")
    const cards = feats.querySelectorAll<HTMLElement>("[data-native-feat]")

    if (prefersReducedMotion()) {
      revealVisible([titleSplit.words, sub, cta, lines, cards])
      return () => titleSplit.revert?.()
    }

    setRevealPending([titleSplit.words, sub, cta], 22)
    utils.set(lines, { opacity: 0, translateX: -12, filter: "blur(6px)" })
    utils.set(cards, { opacity: 0, translateY: 20, filter: "blur(6px)" })

    const scene = createEnterScene(section, {
      lockTargets: () => [titleSplit.words, sub, cta, lines, cards],
    })

    scene
      .add(
        titleSplit.words,
        {
          opacity: [0, 1],
          translateY: [28, 0],
          filter: ["blur(10px)", "blur(0px)"],
          delay: stagger(55),
          duration: 750,
        },
        0,
      )
      .add(sub, { opacity: [0, 1], translateY: [20, 0], duration: 650 }, 180)
      .add(cta, { opacity: [0, 1], scale: [0.96, 1], duration: 600 }, 320)
      .add(
        lines,
        {
          opacity: [0, 1],
          translateX: [-12, 0],
          filter: ["blur(6px)", "blur(0px)"],
          delay: stagger(28),
          duration: 380,
        },
        420,
      )
      .add(
        cards,
        {
          opacity: [0, 1],
          translateY: [20, 0],
          filter: ["blur(6px)", "blur(0px)"],
          delay: stagger(90),
          duration: 650,
        },
        520,
      )

    return () => {
      scene.revert?.()
      titleSplit.revert?.()
    }
  }, [t])

  const feats = [
    { title: t("native.feat1.title"), desc: t("native.feat1.desc") },
    { title: t("native.feat2.title"), desc: t("native.feat2.desc") },
    { title: t("native.feat3.title"), desc: t("native.feat3.desc") },
  ]

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_oklch(0.65_0.2_200_/_0.28),_transparent_70%)] blur-3xl" />
        <div className="gg-grid-mesh absolute inset-0 opacity-40" />
      </div>

      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/[0.06] bg-background/40 px-6 py-4 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2.5">
          <BrandLogo size={36} priority />
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight">{SITE.name}</p>
            <p className="text-[10px] font-medium text-muted-foreground">{t("native.tagline")}</p>
          </div>
        </Link>
        <div className="flex items-center gap-1.5">
          <Link
            href="/"
            className="hidden rounded-full border border-border bg-foreground/[0.03] px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            {t("native.nav.web")}
          </Link>
          <Link
            href="/play"
            className="rounded-full border border-border bg-foreground/[0.03] px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("landing.nav.playground")}
          </Link>
          <button
            type="button"
            onClick={toggleLocale}
            className="rounded-full border border-border bg-foreground/[0.03] px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
          >
            {locale === "en" ? "ES" : "EN"}
          </button>
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-foreground/[0.03] text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
            aria-label="GitHub"
          >
            <Github className="h-3.5 w-3.5" />
          </a>
        </div>
      </header>

      <main className="relative z-10 flex-1">
        <section ref={heroRef} className="relative mx-auto w-full max-w-6xl px-6 pb-20 pt-16 md:pt-24">
          <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                <Smartphone className="h-3 w-3" />
                {t("native.eyebrow")}
              </span>
              <h1
                ref={titleRef}
                className="mt-6 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-[3.25rem]"
              >
                {t("native.title")}
              </h1>
              <p ref={subRef} className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
                {t("native.desc")}
              </p>
              <div ref={ctaRef} className="mt-10 flex flex-wrap items-center gap-4">
                <SiriCtaLink href="/play">
                  <Sparkles className="h-4 w-4 transition-transform duration-500 group-hover:rotate-12" strokeWidth={2.5} />
                  <span>{t("native.cta.play")}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </SiriCtaLink>
                <Link
                  href="/"
                  className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  {t("native.cta.back")}
                </Link>
              </div>
            </div>

            <div className="relative lg:sticky lg:top-24">
              <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-[radial-gradient(circle_at_center,_oklch(0.65_0.18_250_/_0.2),_transparent_70%)] blur-2xl" />
              <div className="gg-glass gg-glass-inset overflow-hidden rounded-2xl">
                <div className="flex items-center justify-between border-b border-white/[0.08] bg-foreground/[0.03] px-4 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    glass-card.tsx · native
                  </span>
                </div>
                <pre
                  ref={codeRef}
                  className="max-h-[min(420px,55vh)] overflow-auto p-5 font-mono text-[11px] leading-[1.65] text-foreground/85 sm:text-xs"
                >
                  {NATIVE_SAMPLE.split("\n").map((line, i) => (
                    <div key={i} data-line className="whitespace-pre">
                      {line || " "}
                    </div>
                  ))}
                </pre>
              </div>
            </div>
          </div>

          <div ref={featsRef} className="mt-20 grid gap-4 sm:grid-cols-3">
            {feats.map((f) => (
              <div
                key={f.title}
                data-native-feat
                className="gg-glass gg-glass-inset rounded-2xl p-5"
              >
                <p className="text-sm font-semibold text-foreground">{f.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/[0.06] bg-background/40 px-6 py-6 text-center text-[11px] text-muted-foreground backdrop-blur-xl">
        <p>
          {t("native.footer")} · <span className="font-mono">v{SITE.version}</span>
        </p>
      </footer>

      <ScrollToTop />
    </div>
  )
}
