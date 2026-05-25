"use client"

import { revealVisible } from "@/lib/landing-motion"

/** Lite mobile: instant visible state + optional CSS class (orchestrator unused on desktop). */
export function landingLiteEnter(targets: unknown, el?: HTMLElement) {
  revealVisible(targets)
  if (el) el.classList.add("gg-landing-lite-reveal")
}
