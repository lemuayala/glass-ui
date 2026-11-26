"use client"

import type { CSSProperties } from "react"
import { cn } from "@/lib/utils"
import { useT } from "@/lib/i18n/provider"
import { parseMarkedWords } from "@/lib/marked-words"
import { ScrollScene } from "./scroll-scene"

/**
 * Apple-style statement: a pinned line of large text whose words light up one by one as you scroll; key words
 * (marked `*like this*` in the copy) light up in the accent gradient. The full sentence stays readable to
 * screen readers; only colour and opacity change.
 */
export function LandingStatement() {
  const t = useT()
  const words = parseMarkedWords(t("landing.statement"))
  const n = words.length

  return (
    <ScrollScene mode="sticky" as="section" labelledBy="statement-text" className="gg-statement-scene relative">
      <div className="gg-statement-pin">
        <p
          id="statement-text"
          className="mx-auto max-w-5xl text-balance px-6 text-center text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {words.map(({ text, key }, i) => (
            <span
              key={`${text}-${i}`}
              className={cn("gg-statement-word", key && "gg-statement-key")}
              style={{ "--t": (i / n) * 0.8, "--n": n } as CSSProperties}
            >
              {text}{" "}
            </span>
          ))}
        </p>
      </div>
    </ScrollScene>
  )
}
