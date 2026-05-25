import * as React from "react"
import { LANDING_LITE_MAX_WIDTH } from "@/lib/mobile-landing"

const MOBILE_BREAKPOINT = LANDING_LITE_MAX_WIDTH + 1

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${LANDING_LITE_MAX_WIDTH}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth <= LANDING_LITE_MAX_WIDTH)
    }
    mql.addEventListener("change", onChange)
    onChange()
    return () => mql.removeEventListener("change", onChange)
  }, [])

  /** Only true after mount confirms mobile — avoids desktop FOUC from assuming mobile. */
  return isMobile === true
}

/** Landing lite: skip canvas, blur orbs, siri animation, heavy scroll listeners. */
export function useLandingLite() {
  const isMobile = useIsMobile()
  const [reduced, setReduced] = React.useState(false)

  React.useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onChange = () => setReduced(mql.matches)
    mql.addEventListener("change", onChange)
    onChange()
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile || reduced
}
