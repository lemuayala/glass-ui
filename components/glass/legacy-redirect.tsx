"use client"

import { useEffect } from "react"
import { PLAYGROUND_PATH } from "./use-url-state"

/** Redirect old share links from `/?c=...` to `/play?c=...` */
export function LegacyPlaygroundRedirect() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.has("c")) {
      window.location.replace(`${PLAYGROUND_PATH}?${params.toString()}`)
    }
  }, [])
  return null
}
