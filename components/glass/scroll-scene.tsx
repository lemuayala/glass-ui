"use client"

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react"
import { prefersReducedMotion } from "@/lib/reduced-motion"
import { SCROLL_SCENE_FINAL, scrollProgress, type ScrollSceneMode } from "@/lib/scroll-progress"

type Scene = {
  el: HTMLElement
  mode: ScrollSceneMode
  last: number
  active: boolean
  onProgress?: (p: number) => void
}

/**
 * One scroll/resize listener and one rAF for every scene on the page. Per frame it reads every active scene's
 * rect first and only then writes `--p` (no read/write interleaving → no forced layouts). Scenes far from the
 * viewport are skipped thanks to an IntersectionObserver.
 */
const scenes = new Set<Scene>()
let raf = 0
let activity: IntersectionObserver | null = null

function frame() {
  raf = 0
  const vh = window.innerHeight
  const scrollY = window.scrollY
  const reads: Array<[Scene, number]> = []
  for (const scene of scenes) {
    if (!scene.active) continue
    const r = scene.el.getBoundingClientRect()
    reads.push([scene, scrollProgress(scene.mode, { scrollY, viewportHeight: vh, top: r.top, height: r.height })])
  }
  for (const [scene, p] of reads) write(scene, p)
}

function write(scene: Scene, p: number) {
  if (Math.abs(p - scene.last) < 0.0005) return
  scene.last = p
  scene.el.style.setProperty("--p", p.toFixed(4))
  scene.onProgress?.(p)
}

function schedule() {
  if (!raf) raf = requestAnimationFrame(frame)
}

function register(scene: Scene): () => void {
  if (scenes.size === 0) {
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
  }
  activity ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        for (const s of scenes) if (s.el === entry.target) s.active = entry.isIntersecting
      }
      schedule()
    },
    // Active from one viewport before entering until one after leaving, so scenes settle at 0 / 1.
    { rootMargin: "100% 0px 100% 0px" },
  )
  scenes.add(scene)
  activity.observe(scene.el)
  schedule()
  return () => {
    scenes.delete(scene)
    activity?.unobserve(scene.el)
    if (scenes.size === 0) {
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      cancelAnimationFrame(raf)
      raf = 0
    }
  }
}

type ScrollSceneProps = {
  mode: ScrollSceneMode
  children: ReactNode
  className?: string
  style?: CSSProperties
  id?: string
  labelledBy?: string
  as?: "div" | "section"
  /** Called when the progress changes — for values CSS can't show (e.g. a live number). */
  onProgress?: (p: number) => void
}

/**
 * Scroll-linked scene, Apple product-page style: writes the scroll progress as `--p` (0 → 1) on the element and
 * CSS does the rest (scale, translate, light up words). With reduced motion it rests in its final state.
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
    const scene: Scene = { el, mode, last: -1, active: true, onProgress: (p) => onProgressRef.current?.(p) }
    if (prefersReducedMotion()) {
      write(scene, SCROLL_SCENE_FINAL[mode])
      return
    }
    return register(scene)
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
