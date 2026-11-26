"use client"

import { formatCompactCount } from "@/lib/format-count"
import { useProjectStats } from "./use-project-stats"

export function formatGitHubStars(n: number): string {
  return formatCompactCount(n)
}

/** GitHub stargazers, served by /api/stats (cached server-side). */
export function useGitHubStars(): number | null {
  return useProjectStats()?.githubStars ?? null
}
