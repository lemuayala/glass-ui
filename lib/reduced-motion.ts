/** `prefers-reduced-motion: reduce` — shared by the landing and the playground. */
export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
}
