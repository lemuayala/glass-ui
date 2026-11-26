"use client"

import { ScrollScene } from "./scroll-scene"

/** Glass vocabulary on top, the stack it ships to below — product terms, the same in every language. */
const TOP = ["Blur", "Frost", "Tint", "Liquid", "Glass"]
const BOTTOM = ["Tailwind", "React Native", "Expo", "shadcn", "MCP"]

/** One row of words, repeated so its end never shows. */
function Row({ words, className }: { words: string[]; className: string }) {
  const all = [...words, ...words, ...words]
  return (
    <div className={`flex w-max gap-[0.45em] whitespace-nowrap ${className}`}>
      {all.map((word, i) => (
        <span key={i} className="flex items-center gap-[0.45em]">
          {word}
          <span className="gg-band-dot" />
        </span>
      ))}
    </div>
  )
}

/**
 * Band of huge words that moves with the scroll, one row each way (Iron Fit's WordBand): it looks endless but only
 * moves while the user scrolls. Decorative, hidden from assistive tech.
 */
export function LandingWordBand() {
  return (
    <ScrollScene mode="through" className="gg-band">
      <div aria-hidden="true">
        <Row words={TOP} className="gg-band-row-a" />
        <Row words={BOTTOM} className="gg-band-row-b" />
      </div>
    </ScrollScene>
  )
}
