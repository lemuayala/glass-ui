"use client"

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react"
import { prefersReducedMotion } from "@/lib/landing-motion"
import { SCROLL_SCENE_FINAL, scrollProgress, type ScrollSceneMode } from "@/lib/scroll-progress"

type ScrollSceneProps = {
  mode: ScrollSceneMode
  children: ReactNode
  className?: string
  style?: CSSProperties
  id?: string
  labelledBy?: string
  as?: "div" | "section"
  /** Called every frame the progress changes — for values CSS can't show (e.g. a live number). */
  onProgress?: (p: number) => void
}

/**
 * Scroll-linked scene, Apple product-page style: writes the scroll progress as `--p` (0 → 1) on the element and
 * CSS does the rest (scale, translate, light up words). One rAF-throttled passive listener, transforms only.
 * With reduced motion it rests in its final state and never listens to scroll.
 */
export function ScrollScene({
  mode,
  children,
  className,
  style,
  id,
  labelledBy,
  as: Tag = "div",
  onProgress,
}: ScrollSceneProps) {
  const ref = useRef<HTMLElement | null>(null)
  const onProgressRef = useRef(onProgress)
  useEffect(() => {
    onProgressRef.current = onProgress
  }, [onProgress])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let last = -1
    const set = (p: number) => {
      if (Math.abs(p - last) < 0.0005) return
      last = p
      el.style.setProperty("--p", p.toFixed(4))
      onProgressRef.current?.(p)
    }

    if (prefersReducedMotion()) {
      set(SCROLL_SCENE_FINAL[mode])
      return
    }

    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      set(scrollProgress(mode, { scrollY: window.scrollY, viewportHeight: window.innerHeight, top: r.top, height: r.height }))
    }
    const schedule = () => {
      if (!raf) raf = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      window.cancelAnimationFrame(raf)
    }
  }, [mode])

  return (
    <Tag
      ref={ref as never}
      id={id}
      aria-labelledby={labelledBy}
      className={className}
      style={{ "--p": SCROLL_SCENE_FINAL[mode], ...style } as CSSProperties}
    >
      {children}
    </Tag>
  )
}
