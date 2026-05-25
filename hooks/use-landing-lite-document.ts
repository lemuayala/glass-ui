"use client"

import { useEffect, useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"

/** Sync `html.gg-landing-lite` only when viewport is confirmed mobile (not before hydrate). */
export function useLandingLiteDocument() {
  const isMobile = useIsMobile()
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onChange = () => setReduced(mql.matches)
    mql.addEventListener("change", onChange)
    onChange()
    return () => mql.removeEventListener("change", onChange)
  }, [])

  const lite = isMobile || reduced

  useEffect(() => {
    document.documentElement.classList.toggle("gg-landing-lite", lite)
    return () => document.documentElement.classList.remove("gg-landing-lite")
  }, [lite])

  useEffect(() => {
    const syncViewport = () => {
      const mobile = window.matchMedia("(max-width: 767px)").matches
      document.documentElement.classList.toggle("gg-viewport-mobile", mobile)
      document.documentElement.classList.toggle("gg-viewport-desktop", !mobile)
    }
    syncViewport()
    const mql = window.matchMedia("(max-width: 767px)")
    mql.addEventListener("change", syncViewport)
    return () => mql.removeEventListener("change", syncViewport)
  }, [])

  return lite
}
