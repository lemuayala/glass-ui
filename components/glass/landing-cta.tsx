"use client"

import { ArrowRight, Sparkles } from "lucide-react"
import { useT } from "@/lib/i18n/provider"
import { NPM_PACKAGES, npmPackageUrl } from "@/lib/config"
import { SiriCtaLink } from "./siri-cta-link"
import { NpmIcon } from "./npm-icon"
import { Reveal, RevealWords } from "./reveal"

export function LandingCta() {
  const t = useT()

  return (
    <section
      id="cta"
      className="relative mx-auto mt-32 w-full max-w-5xl scroll-mt-24 px-6 pb-24 md:mt-48 md:pb-32"
    >
      <Reveal
        className="relative overflow-visible rounded-[2.5rem] border border-white/[0.08] bg-foreground/[0.03] px-6 py-20 text-center max-md:backdrop-blur-none md:backdrop-blur-xl"
      >
        <div className="pointer-events-none absolute -top-32 left-1/2 hidden h-[420px] md:block w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_oklch(0.7_0.18_250_/_0.35),_transparent_70%)] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -right-10 hidden h-[320px] md:block w-[320px] rounded-full bg-[radial-gradient(circle,_oklch(0.75_0.18_340_/_0.25),_transparent_70%)] blur-3xl" />

        <div className="relative">
          <Reveal
            as="span"
            delay={1}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground"
          >
            <Sparkles className="h-3 w-3 text-primary" />
            {t("landing.cta.eyebrow")}
          </Reveal>
          <RevealWords
            text={t("landing.cta.title")}
            className="mx-auto mt-6 max-w-2xl text-balance text-4xl font-bold leading-[1.05] tracking-[-0.025em] text-foreground sm:text-5xl md:text-6xl"
          />
          <Reveal
            as="p"
            delay={3}
            className="mx-auto mt-6 max-w-xl text-balance text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            {t("landing.cta.desc")}
          </Reveal>
          <Reveal delay={4} className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <SiriCtaLink href="/play">
              <Sparkles
                className="h-4 w-4 transition-transform duration-500 group-hover:rotate-12"
                strokeWidth={2.5}
              />
              <span>{t("landing.cta.play")}</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </SiriCtaLink>
            <a
              href={npmPackageUrl(NPM_PACKAGES.core)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground/[0.04] px-6 py-4 text-base font-semibold text-foreground transition-colors hover:bg-foreground/[0.08]"
            >
              <NpmIcon className="h-4 w-4" />
              <span>{t("actions.npm")}</span>
            </a>
          </Reveal>
        </div>
      </Reveal>
    </section>
  )
}
