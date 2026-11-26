import { GITHUB_REPO_URL, NPM_PACKAGES, parseGitHubRepo } from "@/lib/config"
import type { NpmPackageName } from "@/lib/config"

/**
 * Public project stats (GitHub stars, npm version and weekly downloads), fetched on the server and cached.
 *
 * Browsers never call GitHub or npm directly: unauthenticated GitHub allows only 60 requests/hour per IP
 * (403 in the console after a few reloads) and npm returns 404 for downloads until it has stats for a
 * new package. Here both are cached for an hour and failures resolve to `null`.
 */
export const PROJECT_STATS_REVALIDATE_SECONDS = 3600

export type NpmStats = { version: string | null; weeklyDownloads: number | null }
export type ProjectStats = {
  githubStars: number | null
  npm: Record<NpmPackageName, NpmStats>
}

type Fetch = typeof fetch

async function getJson(fetchFn: Fetch, url: string, headers?: HeadersInit): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetchFn(url, { headers, next: { revalidate: PROJECT_STATS_REVALIDATE_SECONDS } })
    return res.ok ? ((await res.json()) as Record<string, unknown>) : null
  } catch {
    return null
  }
}

async function fetchGitHubStars(fetchFn: Fetch): Promise<number | null> {
  const repo = parseGitHubRepo(GITHUB_REPO_URL)
  if (!repo) return null
  const token = process.env.GITHUB_TOKEN
  const data = await getJson(fetchFn, `https://api.github.com/repos/${repo.owner}/${repo.repo}`, {
    Accept: "application/vnd.github+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  })
  return typeof data?.stargazers_count === "number" ? data.stargazers_count : null
}

async function fetchNpmStats(fetchFn: Fetch, name: NpmPackageName): Promise<NpmStats> {
  const [latest, downloads] = await Promise.all([
    getJson(fetchFn, `https://registry.npmjs.org/${name.replace("/", "%2f")}/latest`),
    getJson(fetchFn, `https://api.npmjs.org/downloads/point/last-week/${name}`),
  ])
  return {
    version: typeof latest?.version === "string" ? latest.version : null,
    weeklyDownloads: typeof downloads?.downloads === "number" ? downloads.downloads : null,
  }
}

export async function fetchProjectStats(fetchFn: Fetch = fetch): Promise<ProjectStats> {
  const names = Object.values(NPM_PACKAGES)
  const [githubStars, ...npm] = await Promise.all([
    fetchGitHubStars(fetchFn),
    ...names.map((name) => fetchNpmStats(fetchFn, name)),
  ])
  return {
    githubStars,
    npm: Object.fromEntries(names.map((name, i) => [name, npm[i]])) as Record<NpmPackageName, NpmStats>,
  }
}
