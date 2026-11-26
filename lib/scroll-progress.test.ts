import { describe, expect, it } from "vitest"
import { SCROLL_SCENE_FINAL, clamp01, scrollProgress, segment } from "./scroll-progress"

const vh = 800

describe("scrollProgress", () => {
  it("hero: 0 at the top, 1 after 90% of a viewport, clamped", () => {
    expect(scrollProgress("hero", { scrollY: 0, viewportHeight: vh, top: 0, height: vh })).toBe(0)
    expect(scrollProgress("hero", { scrollY: 360, viewportHeight: vh, top: 0, height: vh })).toBe(0.5)
    expect(scrollProgress("hero", { scrollY: 5000, viewportHeight: vh, top: 0, height: vh })).toBe(1)
  })

  it("sticky: 0 when the scene reaches the top, 1 when its pinned stage is about to leave", () => {
    const height = vh * 3
    expect(scrollProgress("sticky", { scrollY: 0, viewportHeight: vh, top: 300, height })).toBe(0)
    expect(scrollProgress("sticky", { scrollY: 0, viewportHeight: vh, top: 0, height })).toBe(0)
    expect(scrollProgress("sticky", { scrollY: 0, viewportHeight: vh, top: -vh, height })).toBe(0.5)
    expect(scrollProgress("sticky", { scrollY: 0, viewportHeight: vh, top: -2 * vh, height })).toBe(1)
  })

  it("through: 0 entering at the bottom, 0.5 centered, 1 leaving at the top", () => {
    const height = 400
    expect(scrollProgress("through", { scrollY: 0, viewportHeight: vh, top: vh, height })).toBe(0)
    expect(scrollProgress("through", { scrollY: 0, viewportHeight: vh, top: 200, height })).toBe(0.5)
    expect(scrollProgress("through", { scrollY: 0, viewportHeight: vh, top: -height, height })).toBe(1)
  })

  it("never divides by zero", () => {
    expect(scrollProgress("sticky", { scrollY: 0, viewportHeight: 0, top: -10, height: 0 })).toBeGreaterThanOrEqual(0)
  })

  it("final states keep each scene readable without motion", () => {
    expect(SCROLL_SCENE_FINAL).toEqual({ hero: 0, sticky: 1, through: 0.5 })
  })
})

describe("segment / clamp01", () => {
  it("maps a sub-range of progress to 0–1", () => {
    expect(segment(0.4, 0.4, 0.8)).toBe(0)
    expect(segment(0.6, 0.4, 0.8)).toBeCloseTo(0.5)
    expect(segment(0.9, 0.4, 0.8)).toBe(1)
    expect(clamp01(-2)).toBe(0)
    expect(clamp01(2)).toBe(1)
  })
})
