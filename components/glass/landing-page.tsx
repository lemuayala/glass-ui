"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import { animate, createScope, utils } from "animejs"
import { Github } from "lucide-react"
import { useT, useI18n } from "@/lib/i18n/provider"
import { GITHUB_REPO_URL, SITE } from "@/lib/config"
import { BrandLogo } from "./brand-logo"
import { LandingHero } from "./landing-hero"
import { LandingShowcase, LandingMarquee } from "./landing-showcase"
import { LandingCode } from "./landing-code"
import { LandingSteps } from "./landing-steps"
import { LandingCta } from "./landing-cta"
import { ScrollToTop } from "./scroll-to-top"

export function LandingPage() {
  const t = useT()
  const { locale, toggleLocale } = useI18n()
  const rootRef = useRef<HTMLDivElement | null>(null)
  const headerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    const header = headerRef.current
    if (!root || !header) return

    const scope = createScope({
      root,
      mediaQueries: {
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
    })

    scope.add((self) => {
      if (!self) return

      if (self.matches.reduceMotion) {
        utils.set(header, { opacity: 1, translateY: 0 })
        return
      }

      utils.set(header, { opacity: 0, translateY: -12 })
      const navAnim = animate(header, {
        opacity: [0, 1],
        translateY: [-12, 0],
        duration: 800,
        ease: "out(3)",
      })
      return () => navAnim.revert?.()
    })

    return () => scope.revert()
  }, [])

  return (
    <div ref={rootRef} className="relative flex min-h-screen flex-col overflow-x-hidden">
      {/* Ambient orbs — sit behind everything */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="gg-orb absolute -top-40 left-1/2 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_oklch(0.7_0.18_250_/_0.32),_transparent_70%)] blur-3xl" />
        <div className="gg-orb gg-orb-2 absolute top-1/3 -left-32 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,_oklch(0.75_0.18_340_/_0.22),_transparent_70%)] blur-3xl" />
        <div className="gg-orb gg-orb-3 absolute top-2/3 right-0 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,_oklch(0.78_0.18_60_/_0.18),_transparent_70%)] blur-3xl" />
        {/* Premium grid mesh */}
        <div className="gg-grid-mesh absolute inset-0 opacity-50" />
      </div>

      <header
        ref={headerRef}
        className="sticky top-0 z-30 flex items-center justify-between border-b border-white/[0.06] bg-background/40 px-6 py-4 backdrop-blur-xl"
      >
        <Link href="/" className="flex items-center gap-2.5">
          <BrandLogo size={36} priority />
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight">{SITE.name}</p>
            <p className="text-[10px] font-medium text-muted-foreground">{t("brand.tagline")}</p>
          </div>
        </Link>
        <div className="flex items-center gap-1.5">
          <Link
            href="/native"
            className="hidden rounded-full border border-border bg-foreground/[0.03] px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground sm:inline-flex"
          >
            {t("landing.nav.native")}
          </Link>
          <Link
            href="/play"
            className="hidden rounded-full border border-border bg-foreground/[0.03] px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground md:inline-flex"
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
        {/* 1 — Inicio (hero hasta “en vivo — prueba cada componente”) */}
        <LandingHero />

        {/* 2 — Primitivos (al hacer scroll, como secciones del portfolio) */}
        <LandingShowcase />
        <LandingMarquee />

        <LandingCode />

        <LandingSteps />

        <LandingCta />
      </main>

      <footer className="relative z-10 border-t border-white/[0.06] bg-background/40 px-6 py-6 text-center text-[11px] text-muted-foreground backdrop-blur-xl">
        <p>
          {t("landing.footer")} · <span className="font-mono">v{SITE.version}</span>
        </p>
      </footer>

      <ScrollToTop />
    </div>
  )
}
