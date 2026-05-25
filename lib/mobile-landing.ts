import { prefersReducedMotion } from "@/lib/landing-motion"

/** Matches Tailwind `md:` — landing lite mode below this width. */
export const LANDING_LITE_MAX_WIDTH = 767

export const LANDING_LITE_MEDIA = `(max-width: ${LANDING_LITE_MAX_WIDTH}px)`

export function isLandingLiteViewport(): boolean {
  if (typeof window === "undefined") return true
  return (
    window.matchMedia(LANDING_LITE_MEDIA).matches || prefersReducedMotion()
  )
}
