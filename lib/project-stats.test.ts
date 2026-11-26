import { describe, expect, it, vi } from "vitest"
import { NPM_PACKAGES } from "./config"
import { fetchProjectStats } from "./project-stats"

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status })

describe("fetchProjectStats", () => {
  it("collects stars, versions and downloads", async () => {
    const fetchFn = vi.fn(async (url: string | URL | Request) => {
      const u = String(url)
      if (u.startsWith("https://api.github.com/")) return json({ stargazers_count: 27 })
      if (u.startsWith("https://registry.npmjs.org/")) return json({ version: "0.6.1" })
      return json({ downloads: 140 })
    }) as unknown as typeof fetch

    const stats = await fetchProjectStats(fetchFn)
    expect(stats.githubStars).toBe(27)
    expect(stats.npm[NPM_PACKAGES.core]).toEqual({ version: "0.6.1", weeklyDownloads: 140 })
    expect(stats.npm[NPM_PACKAGES.mcp]).toEqual({ version: "0.6.1", weeklyDownloads: 140 })
    expect(String((fetchFn as unknown as ReturnType<typeof vi.fn>).mock.calls[1][0])).toContain("%2f")
  })

  it("resolves GitHub rate limits, missing npm stats and network errors to null", async () => {
    const fetchFn = vi.fn(async (url: string | URL | Request) => {
      const u = String(url)
      if (u.startsWith("https://api.github.com/")) return json({ message: "rate limit" }, 403)
      if (u.startsWith("https://api.npmjs.org/")) return json({ error: "not found" }, 404)
      throw new Error("offline")
    }) as unknown as typeof fetch

    const stats = await fetchProjectStats(fetchFn)
    expect(stats.githubStars).toBeNull()
    expect(stats.npm[NPM_PACKAGES.core]).toEqual({ version: null, weeklyDownloads: null })
  })
})
