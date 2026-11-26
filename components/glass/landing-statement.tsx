"use client"

import type { CSSProperties } from "react"
import { useT } from "@/lib/i18n/provider"
import { ScrollScene } from "./scroll-scene"

/**
 * Apple-style statement: a pinned line of large text whose words light up one by one as you scroll.
 * The full sentence stays in the DOM for screen readers; only the opacity changes.
 */
export function LandingStatement() {
  const t = useT()
  const words = t("landing.statement").split(" ")
  const n = words.length

  return (
    <ScrollScene mode="sticky" as="section" labelledBy="statement-text" className="gg-statement-scene relative">
      <div className="gg-statement-pin">
        <p
          id="statement-text"
          className="mx-auto max-w-5xl text-balance px-6 text-center text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {words.map((word, i) => (
            <span
              key={`${word}-${i}`}
              className="gg-statement-word"
              style={{ "--t": (i / n) * 0.8, "--n": n } as CSSProperties}
            >
              {word}{" "}
            </span>
          ))}
        </p>
      </div>
    </ScrollScene>
  )
}
