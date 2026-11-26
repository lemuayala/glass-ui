"use client"

import type { NpmPackageName } from "@/lib/config"
import type { NpmStats } from "@/lib/project-stats"
import { useProjectStats } from "./use-project-stats"

export type NpmPackageStats = NpmStats

/** Latest version + weekly downloads, served by /api/stats (cached server-side). */
export function useNpmPackage(packageName: NpmPackageName): NpmPackageStats {
  return useProjectStats()?.npm[packageName] ?? { version: null, weeklyDownloads: null }
}
