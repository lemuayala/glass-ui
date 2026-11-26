/**
 * Scroll progress (0 → 1) for scroll-linked landing scenes, Apple product-page style.
 *
 * - `hero`:    distance scrolled from the very top, up to 90% of a viewport.
 * - `sticky`:  travel through a tall section with a pinned stage (0 when it reaches the top, 1 when it leaves).
 * - `through`: passage across the viewport (0 entering at the bottom, 0.5 centered, 1 leaving at the top).
 */
export type ScrollSceneMode = "hero" | "sticky" | "through"

/** Resting progress for reduced motion / no JS: the scene's final, fully readable state. */
export const SCROLL_SCENE_FINAL: Record<ScrollSceneMode, number> = { hero: 0, sticky: 1, through: 0.5 }

export type ScrollMetrics = {
  /** `window.scrollY` */
  scrollY: number
  /** `window.innerHeight` */
  viewportHeight: number
  /** `getBoundingClientRect().top` of the scene */
  top: number
  /** `getBoundingClientRect().height` of the scene */
  height: number
}

export function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n))
}

export function scrollProgress(mode: ScrollSceneMode, m: ScrollMetrics): number {
  const vh = Math.max(1, m.viewportHeight)
  switch (mode) {
    case "hero":
      return clamp01(m.scrollY / (vh * 0.9))
    case "sticky":
      return clamp01(-m.top / Math.max(1, m.height - vh))
    case "through":
      return clamp01((vh - m.top) / (vh + m.height))
  }
}

/** Progress of a sub-range [start, end] of the scene, e.g. `segment(p, 0.4, 0.75)`. */
export function segment(p: number, start: number, end: number): number {
  return clamp01((p - start) / Math.max(1e-6, end - start))
}
