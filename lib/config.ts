/**
 * Centralized project metadata.
 *
 * To wire your own GitHub repo:
 *   1. Update GITHUB_REPO_URL below, or
 *   2. Set the env var NEXT_PUBLIC_GITHUB_URL in your Vercel project.
 *
 * The "Star" button in the header will link to this URL and (if it points to
 * GitHub) fetch the live star count from the public REST API.
 */

export const SITE = {
  name: "Glass UI",
  tagline: "Glassmorphism Generator",
  version: "0.3.0",
} as const

const ENV_GITHUB =
  typeof process !== "undefined" ? process.env.NEXT_PUBLIC_GITHUB_URL : undefined

export const GITHUB_REPO_URL =
  ENV_GITHUB || "https://github.com/your-org/glass-ui"

/** owner/repo extracted from a github.com URL, or null if not GitHub. */
export function parseGitHubRepo(url: string): { owner: string; repo: string } | null {
  try {
    const u = new URL(url)
    if (u.hostname !== "github.com") return null
    const [owner, repo] = u.pathname.replace(/^\/|\/$/g, "").split("/")
    if (!owner || !repo) return null
    return { owner, repo: repo.replace(/\.git$/, "") }
  } catch {
    return null
  }
}
