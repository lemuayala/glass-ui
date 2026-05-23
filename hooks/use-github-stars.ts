"use client"

import { useEffect, useState } from "react"
import { GITHUB_REPO_URL, parseGitHubRepo } from "@/lib/config"

export function formatGitHubStars(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(n)
}

/** Live stargazers count from the public GitHub REST API. */
export function useGitHubStars(): number | null {
  const [stars, setStars] = useState<number | null>(null)

  useEffect(() => {
    const repo = parseGitHubRepo(GITHUB_REPO_URL)
    if (!repo) return

    const ctrl = new AbortController()
    fetch(`https://api.github.com/repos/${repo.owner}/${repo.repo}`, {
      signal: ctrl.signal,
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && typeof data.stargazers_count === "number") {
          setStars(data.stargazers_count)
        }
      })
      .catch(() => {})

    return () => ctrl.abort()
  }, [])

  return stars
}
