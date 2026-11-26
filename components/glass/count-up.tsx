"use client"

import { useEffect, useRef } from "react"
import { observeReveal } from "@/lib/reveal-observer"
import { prefersReducedMotion } from "@/lib/reduced-motion"

const DURATION_MS = 1200

/**
 * Number that counts up from 0 when it enters the viewport. The server renders the final value, so it is never
 * stuck at 0: without JS, under reduced motion, or if the count never starts, the real number is shown.
 * Updates React's own text node in place (nodeValue) — no re-render per frame, no DOM replaced under React.
 */
export function CountUp({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    const el = ref.current
    const node = el?.firstChild
    if (!el || !(node instanceof Text) || prefersReducedMotion()) return
    let raf = 0
    const run = () => {
      // Already scrolled past: keep the final value instead of counting off-screen.
      if (el.getBoundingClientRect().bottom < 0) return
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / DURATION_MS)
        node.nodeValue = Math.round(value * (1 - Math.pow(1 - t, 3))).toLocaleString()
        if (t < 1) raf = requestAnimationFrame(tick)
      }
      node.nodeValue = "0"
      raf = requestAnimationFrame(tick)
    }
    const stop = observeReveal(el, run)
    return () => {
      stop()
      cancelAnimationFrame(raf)
      node.nodeValue = value.toLocaleString()
    }
  }, [value])

  return (
    <span ref={ref} className={className}>
      {value.toLocaleString()}
    </span>
  )
}
