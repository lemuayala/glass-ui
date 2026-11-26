"use client"

import { useEffect, useState } from "react"

export type NpmPackageStats = {
  /** Latest published version (registry `latest` dist-tag). */
  version: string | null
  /** Last-week downloads; null until npm compiles stats for the package (~1 day after first publish). */
  weeklyDownloads: number | null
}

async function fetchJson(url: string, signal: AbortSignal): Promise<unknown> {
  const res = await fetch(url, { signal })
  return res.ok ? res.json() : null
}

/** Live version + weekly downloads from the public, CORS-enabled npm APIs. */
export function useNpmPackage(packageName: string): NpmPackageStats {
  const [stats, setStats] = useState<NpmPackageStats>({ version: null, weeklyDownloads: null })

  useEffect(() => {
    const ctrl = new AbortController()
    const registryName = packageName.replace("/", "%2f")

    Promise.allSettled([
      fetchJson(`https://registry.npmjs.org/${registryName}/latest`, ctrl.signal),
      fetchJson(`https://api.npmjs.org/downloads/point/last-week/${packageName}`, ctrl.signal),
    ]).then(([latest, downloads]) => {
      if (ctrl.signal.aborted) return
      const version =
        latest.status === "fulfilled" && typeof (latest.value as { version?: unknown })?.version === "string"
          ? (latest.value as { version: string }).version
          : null
      const weeklyDownloads =
        downloads.status === "fulfilled" && typeof (downloads.value as { downloads?: unknown })?.downloads === "number"
          ? (downloads.value as { downloads: number }).downloads
          : null
      setStats({ version, weeklyDownloads })
    })

    return () => ctrl.abort()
  }, [packageName])

  return stats
}
