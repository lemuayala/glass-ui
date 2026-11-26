"use client"

import { useEffect, useState } from "react"
import type { ProjectStats } from "@/lib/project-stats"

let request: Promise<ProjectStats | null> | null = null

/** One request per page load, shared by every component that shows stats. */
function loadProjectStats(): Promise<ProjectStats | null> {
  request ??= fetch("/api/stats")
    .then((r) => (r.ok ? (r.json() as Promise<ProjectStats>) : null))
    .catch(() => null)
  return request
}

export function useProjectStats(): ProjectStats | null {
  const [stats, setStats] = useState<ProjectStats | null>(null)
  useEffect(() => {
    let active = true
    loadProjectStats().then((s) => active && setStats(s))
    return () => {
      active = false
    }
  }, [])
  return stats
}
