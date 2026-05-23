"use client"

import Link from "next/link"
import { ArrowRight, Smartphone, Sparkles } from "lucide-react"
import { useT } from "@/lib/i18n/provider"

const FEATS = [
  { title: "native.feat1.title", desc: "native.feat1.desc" },
  { title: "native.feat2.title", desc: "native.feat2.desc" },
  { title: "native.feat3.title", desc: "native.feat3.desc" },
] as const

export function LandingNativeStrip() {
  const t = useT()

  return (
    <section
      id="native"
      className="relative mx-auto mt-24 w-full max-w-6xl scroll-mt-24 px-6 md:mt-32"
    >
      <div className="gg-glass gg-glass-inset rounded-3xl border border-border p-6 md:p-10">
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <Smartphone className="h-3 w-3" strokeWidth={2.2} />
              {t("native.eyebrow")}
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {t("native.title")}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">{t("native.desc")}</p>
            <Link
              href="/play"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-foreground/80"
            >
              <Sparkles className="h-4 w-4" strokeWidth={2.2} />
              {t("native.cta.play")}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <ul className="grid gap-3 sm:grid-cols-3 lg:max-w-[52%] lg:gap-4">
            {FEATS.map((feat) => (
              <li
                key={feat.title}
                className="rounded-2xl border border-white/[0.08] bg-foreground/[0.03] px-4 py-3.5 backdrop-blur-sm"
              >
                <p className="text-sm font-semibold text-foreground">{t(feat.title)}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t(feat.desc)}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
