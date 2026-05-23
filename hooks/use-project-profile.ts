"use client"

import { useCallback, useEffect, useState } from "react"
import {
  DEFAULT_PROJECT_PROFILE,
  readProjectProfile,
  writeProjectProfile,
  type ProjectProfile,
} from "@/lib/glass-core/project-profile"

export function useProjectProfile() {
  const [profile, setProfile] = useState<ProjectProfile>(DEFAULT_PROJECT_PROFILE)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setProfile(readProjectProfile())
    setHydrated(true)
  }, [])

  const updateProfile = useCallback((patch: Partial<ProjectProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...patch }
      writeProjectProfile(next)
      return next
    })
  }, [])

  return { profile, updateProfile, hydrated }
}
