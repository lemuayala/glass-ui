import { prefersReducedMotion } from "@/lib/landing-motion"

/** Matches Tailwind `md:` — landing lite mode below this width. */
export const LANDING_LITE_MAX_WIDTH = 767

export const LANDING_LITE_MEDIA = `(max-width: ${LANDING_LITE_MAX_WIDTH}px)`

/** Playground mobile layout uses Tailwind `lg` (1024px). */
export const PLAYGROUND_MOBILE_MAX_WIDTH = 1023

export function isLandingLiteViewport(): boolean {
  if (typeof window === "undefined") return true
  return (
    window.matchMedia(LANDING_LITE_MEDIA).matches || prefersReducedMotion()
  )
}

export function isPlaygroundMobileViewport(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia(`(max-width: ${PLAYGROUND_MOBILE_MAX_WIDTH}px)`).matches
}
