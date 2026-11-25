import { describe, expect, it } from "vitest"
import {
  getGlassButtonClasses,
  getGlassCardClasses,
  getGlassInputClasses,
  getGlassModalClasses,
  getGlassNavbarClasses,
  getGlassSwitchClasses,
  getGlassTabBarClasses,
} from "./variants"
import type { GlassOptions, GlassTint } from "./types"

const classHelpers = [
  ["card", getGlassCardClasses],
  ["button", getGlassButtonClasses],
  ["input", getGlassInputClasses],
  ["modal", getGlassModalClasses],
  ["tabbar", getGlassTabBarClasses],
  ["switch", getGlassSwitchClasses],
  ["navbar", getGlassNavbarClasses],
] as const

const base: GlassOptions = {
  theme: "dark",
  blur: "lg",
  rounded: "2xl",
  intensity: "medium",
  border: "subtle",
  padding: "md",
  shadow: "md",
  tint: "none",
}

describe("glass-core variants & twMerge resolution", () => {
  it.each(classHelpers)("resolves base dark/light classes for %s without duplicate bg-*", (_name, fn) => {
    const darkCls = fn({ ...base, theme: "dark", tint: "none" })
    const lightCls = fn({ ...base, theme: "light", tint: "none" })

    const darkBgs = darkCls.split(/\s+/).filter((t) => t.startsWith("bg-"))
    const lightBgs = lightCls.split(/\s+/).filter((t) => t.startsWith("bg-"))

    expect(darkBgs).toHaveLength(1)
    expect(lightBgs).toHaveLength(1)
    expect(darkCls).toContain("backdrop-blur-lg")
    expect(darkCls).toContain("rounded-2xl")
  })

  it.each(classHelpers)("overrides neutral bg with tint bg via twMerge for %s", (_name, fn) => {
    const tints: Exclude<GlassTint, "none">[] = ["blue", "pink", "orange", "teal"]
    for (const tint of tints) {
      const cls = fn({ ...base, tint, intensity: "strong" })
      const bgs = cls.split(/\s+/).filter((t) => t.startsWith("bg-"))
      expect(bgs).toHaveLength(1)
      expect(bgs[0]).toContain(`bg-${tint}-500/`)
    }
  })

  it.each(classHelpers)("omits backdrop-blur and border when set to none for %s", (_name, fn) => {
    const cls = fn({
      ...base,
      blur: "none",
      border: "none",
      shadow: "none",
      rounded: "full",
    })
    expect(cls).not.toContain("backdrop-blur")
    expect(cls.split(/\s+/)).not.toContain("border")
    expect(cls.split(/\s+/)).not.toContain("border-2")
    expect(cls).toContain("rounded-full")
  })

  it.each(classHelpers)("applies border-2 when border is strong for %s", (_name, fn) => {
    const cls = fn({ ...base, border: "strong" })
    expect(cls.split(/\s+/)).toContain("border-2")
  })
})
