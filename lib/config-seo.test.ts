import { renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import robots from "@/app/robots"
import sitemap from "@/app/sitemap"
import { formatGitHubStars } from "@/hooks/use-github-stars"
import { useLandingLiteDocument } from "@/hooks/use-landing-lite-document"
import { useLandingLite } from "@/hooks/use-mobile"
import { SITE, SITE_URL, parseGitHubRepo } from "./config"
import { IPHONE_17_PRO_MAX, PREVIEW_DEVICE_FRAMES } from "./device-frame"
import { isLandingLiteViewport, LANDING_LITE_MAX_WIDTH } from "./mobile-landing"
import { PLAY_METADATA, rootMetadata, siteJsonLd } from "./seo"

describe("config, SEO, sitemap, robots & device helpers", () => {
  it("parses valid GitHub URLs and rejects invalid or non-GitHub URLs", () => {
    expect(parseGitHubRepo("https://github.com/lemuayala/glass-ui")).toEqual({
      owner: "lemuayala",
      repo: "glass-ui",
    })
    expect(parseGitHubRepo("https://github.com/lemuayala/glass-ui.git/")).toEqual({
      owner: "lemuayala",
      repo: "glass-ui",
    })
    expect(parseGitHubRepo("https://gitlab.com/lemuayala/glass-ui")).toBeNull()
    expect(parseGitHubRepo("https://github.com/only-owner")).toBeNull()
    expect(parseGitHubRepo("not-a-url")).toBeNull()
  })

  it("formats GitHub star counts cleanly", () => {
    expect(formatGitHubStars(42)).toBe("42")
    expect(formatGitHubStars(1000)).toBe("1k")
    expect(formatGitHubStars(1250)).toBe("1.3k")
    expect(formatGitHubStars(12400)).toBe("12.4k")
  })

  it("builds valid JSON-LD, rootMetadata, robots, and sitemap", () => {
    const ld = siteJsonLd()
    expect(ld["@type"]).toBe("WebApplication")
    expect(ld.url).toBe(SITE_URL)
    expect(ld.name).toBe(SITE.name)

    const meta = rootMetadata()
    expect(meta.metadataBase?.toString()).toBe(`${SITE_URL}/`)
    expect(PLAY_METADATA.alternates?.canonical).toBe("/play")

    const rb = robots()
    expect(rb.sitemap).toBe(`${SITE_URL}/sitemap.xml`)

    const sm = sitemap()
    expect(sm.map((entry) => entry.url)).toEqual([SITE_URL, `${SITE_URL}/play`])
  })

  it("exposes valid device frame dimensions and mobile viewport helpers", () => {
    expect(IPHONE_17_PRO_MAX.width).toBeGreaterThan(300)
    expect(PREVIEW_DEVICE_FRAMES.ipad.width).toBeGreaterThan(IPHONE_17_PRO_MAX.width)
    expect(LANDING_LITE_MAX_WIDTH).toBe(767)
    expect(typeof isLandingLiteViewport()).toBe("boolean")

    Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 390 })
    vi.spyOn(window, "matchMedia").mockImplementation((query: string) => ({
      matches: query.includes("767") || query.includes("reduce"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    const { unmount } = renderHook(() => useLandingLiteDocument())
    expect(document.documentElement.classList.contains("gg-landing-lite")).toBe(true)
    unmount()
    expect(document.documentElement.classList.contains("gg-landing-lite")).toBe(false)

    const liteHook = renderHook(() => useLandingLite())
    expect(liteHook.result.current).toBe(true)
  })
})
