"use client"

import type { CSSProperties } from "react"
import { ArrowRight, Bot, ChevronDown, Sparkles } from "lucide-react"
import { NPM_PACKAGES, npmPackageUrl } from "@/lib/config"
import { useT } from "@/lib/i18n/provider"
import { prefersReducedMotion } from "@/lib/reduced-motion"
import { SiriCtaLink } from "./siri-cta-link"
import { LandingParticles } from "./landing-particles"
import { ScrollScene } from "./scroll-scene"
import { CopyButton } from "./copy-button"
import { NpmIcon } from "./npm-icon"

const HERO_INSTALL_COMMAND = `npx ${NPM_PACKAGES.core} add card`

const HERO_SECONDARY_LINK =
  "inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-foreground/[0.03] px-4 text-xs font-medium text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground"

/** Stagger for the CSS entrance on load (`.gg-hero-in`): no JS needed, so the hero is never blank. */
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties

export function LandingHero() {
  const t = useT()

  const scrollToPrimitives = () => {
    document
      .querySelector("#primitives")
      ?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" })
  }

  return (
    <section
      id="inicio"
      className="relative flex w-full min-h-[calc(100dvh-4.25rem)] flex-col items-center justify-center px-6 py-16 text-center md:py-20"
    >
      {/* Hero luma + magical particles (particles never run on phones, see LandingParticles) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-visible">
        <div className="gg-hero-ambient-lite absolute inset-0 md:hidden" aria-hidden />
        <div className="absolute inset-0 hidden overflow-visible md:block" aria-hidden>
          <LandingParticles />
          <div className="gg-inicio-beam absolute left-1/2 top-[12%] h-[min(520px,70vh)] w-[min(100vw,900px)] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,_oklch(0.62_0.22_265_/_0.4),_transparent_68%)] blur-3xl" />
          <div className="gg-inicio-beam gg-inicio-beam-2 absolute -left-[10%] top-[38%] h-[min(320px,45vh)] w-[min(55vw,420px)] rounded-full bg-[radial-gradient(circle,_oklch(0.72_0.2_320_/_0.34),_transparent_70%)] blur-3xl" />
          <div className="gg-inicio-beam gg-inicio-beam-3 absolute -right-[8%] top-[22%] h-[min(360px,48vh)] w-[min(50vw,400px)] rounded-full bg-[radial-gradient(circle,_oklch(0.75_0.18_195_/_0.28),_transparent_70%)] blur-3xl" />
        </div>
      </div>

      <ScrollScene mode="hero" className="gg-hero-recede relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center">
        <span
          style={delay(0)}
          className="gg-hero-in inline-flex items-center gap-2 rounded-full border border-border bg-foreground/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground max-md:backdrop-blur-none md:backdrop-blur-md"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-60 max-md:hidden" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          {t("landing.badge")}
        </span>

        <h1 className="mt-7 max-w-[20ch] text-balance text-5xl font-bold leading-[1.02] tracking-[-0.03em] text-foreground sm:text-6xl md:max-w-[16ch] md:text-7xl md:leading-[0.95] lg:text-[88px]">
          <span style={delay(90)} className="gg-hero-in inline-block">
            {t("landing.headlineLead")}
          </span>{" "}
          <span style={delay(220)} data-headline-accent className="gg-hero-in gg-text-accent inline-block">
            {t("landing.headlineAccent")}
          </span>
        </h1>

        <p
          style={delay(360)}
          className="gg-hero-in mt-7 max-w-xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl"
        >
          {t("landing.subhead")}
        </p>

        <div style={delay(480)} className="gg-hero-in mt-12 flex w-full flex-col items-center gap-5">
          <SiriCtaLink href="/play">
            <Sparkles
              className="h-4 w-4 transition-transform duration-500 group-hover:rotate-12"
              strokeWidth={2.5}
            />
            <span>{t("landing.cta.play")}</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </SiriCtaLink>

          <div className="gg-glass gg-glass-inset flex max-w-full items-center gap-3 rounded-full py-1 pl-4 pr-1">
            <code className="min-w-0 truncate font-mono text-xs text-foreground/90">
              <span className="select-none text-muted-foreground">$ </span>
              {HERO_INSTALL_COMMAND}
            </code>
            <CopyButton text={HERO_INSTALL_COMMAND} copyLabel={t("actions.copy")} copiedLabel={t("actions.copied")} />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <a href={npmPackageUrl(NPM_PACKAGES.core)} target="_blank" rel="noopener noreferrer" className={HERO_SECONDARY_LINK}>
              <NpmIcon />
              <span>{t("actions.npm")}</span>
            </a>
            <a href="#agents" className={HERO_SECONDARY_LINK}>
              <Bot className="h-3.5 w-3.5 shrink-0" strokeWidth={2.2} />
              <span>{t("landing.hero.mcp")}</span>
            </a>
          </div>
        </div>

        <div style={delay(620)} className="gg-hero-in mt-10 inline-flex items-center gap-2 text-[11px] text-muted-foreground/80">
          <span className="gg-live-dot inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
          <span className="font-mono uppercase tracking-wider">{t("landing.live")}</span>
        </div>

        <button
          style={delay(720)}
          type="button"
          onClick={scrollToPrimitives}
          className="gg-hero-in mt-10 inline-flex flex-col items-center gap-1.5 text-muted-foreground/80 transition-colors hover:text-foreground"
          aria-label={t("landing.scrollHint")}
        >
          <ChevronDown className="h-4 w-4 max-md:animate-none md:animate-bounce" strokeWidth={2.2} />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em]">{t("landing.scrollHint")}</span>
        </button>
      </ScrollScene>
    </section>
  )
}
