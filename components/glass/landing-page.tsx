"use client"

import Link from "next/link"
import { useT, useI18n } from "@/lib/i18n/provider"
import { SITE } from "@/lib/config"
import { BrandLockup } from "./brand-lockup"
import { GitHubStarLink } from "./github-star-link"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLandingLiteDocument } from "@/hooks/use-landing-lite-document"
import { LandingHero } from "./landing-hero"
import { LandingShowcase, LandingMarquee } from "./landing-showcase"
import { LandingCode } from "./landing-code"
import { LandingNativeStrip } from "./landing-native-strip"
import { LandingSteps } from "./landing-steps"
import { LandingCta } from "./landing-cta"
import { ScrollToTop } from "./scroll-to-top"
import { SiteFooterCredit } from "./site-footer-credit"

export function LandingPage() {
  const t = useT()
  const { locale, toggleLocale } = useI18n()
  useLandingLiteDocument()

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-clip">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 md:hidden"
      >
        <div className="gg-landing-ambient-gradient h-full w-full" />
      </div>
      <div aria-hidden className="pointer-events-none gg-landing-ambient-orbs fixed inset-0 -z-10 hidden md:block">
        <div className="gg-orb absolute -top-40 left-1/2 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_oklch(0.7_0.2_250_/_0.36),_transparent_70%)] blur-3xl" />
        <div className="gg-orb gg-orb-2 absolute top-1/3 -left-32 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,_oklch(0.75_0.18_340_/_0.26),_transparent_70%)] blur-3xl" />
        <div className="gg-orb gg-orb-3 absolute top-2/3 right-0 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,_oklch(0.78_0.18_195_/_0.22),_transparent_70%)] blur-3xl" />
        <div className="gg-grid-mesh absolute inset-0 opacity-55" />
      </div>

      <header className="sticky top-0 z-30 flex w-full items-center justify-between gap-2 border-b border-white/[0.06] bg-background/90 px-3 py-2 backdrop-blur-none max-md:bg-background/90 md:bg-background/40 md:backdrop-blur-xl sm:px-6 sm:py-3">
        <BrandLockup href="/" logoSize={28} priority />
        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
          <Link
            href="/play"
            aria-label={t("landing.nav.playground")}
            className={cn(
              "flex h-8 items-center justify-center rounded-full border border-border bg-foreground/[0.03] text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground",
              "w-8 sm:w-auto sm:gap-1.5 sm:px-3",
            )}
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0" strokeWidth={2.2} />
            <span className="hidden text-[11px] font-medium md:inline">{t("landing.nav.playground")}</span>
          </Link>
          <button
            type="button"
            onClick={toggleLocale}
            className="flex h-8 min-w-8 items-center justify-center rounded-full border border-border bg-foreground/[0.03] px-2 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
          >
            {locale === "en" ? "ES" : "EN"}
          </button>
          <GitHubStarLink compact />
        </div>
      </header>

      <main className="relative z-10 flex-1">
        {/* 1 — Inicio (hero hasta “en vivo — prueba cada componente”) */}
        <LandingHero />

        {/* 2 — Primitivos (al hacer scroll, como secciones del portfolio) */}
        <LandingShowcase />
        <LandingMarquee />

        <LandingCode />

        <LandingNativeStrip />

        <LandingSteps />

        <LandingCta />
      </main>

      <footer className="relative z-10 flex flex-col items-center gap-2 border-t border-white/[0.06] bg-background/90 px-6 py-6 text-center backdrop-blur-none max-md:bg-background/90 md:bg-background/40 md:backdrop-blur-xl">
        <p className="text-[11px] text-muted-foreground">
          {t("landing.footer")} · <span className="font-mono">v{SITE.version}</span>
        </p>
        <SiteFooterCredit />
      </footer>

      <ScrollToTop />
    </div>
  )
}
