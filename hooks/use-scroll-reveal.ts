"use client"

import { useEffect, useRef } from "react"
import { animate, onScroll, stagger, type AnimationParams } from "animejs"

/**
 * Run an anime.js animation on a set of targets when they enter the viewport.
 * Returns a ref to attach to the container (used as selector root).
 *
 * Defaults are Apple-grade: subtle blur reveal + slight Y shift with stagger.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(options?: {
  selector?: string
  /** ms between each item */
  staggerMs?: number
  /** ms before the first item starts */
  startDelay?: number
  /** anime.js AnimationParams overrides */
  params?: Partial<AnimationParams>
  /** Trigger again every time the element re-enters */
  repeat?: boolean
}) {
  const containerRef = useRef<T | null>(null)

  useEffect(() => {
    const root = containerRef.current
    if (!root) return

    const selector = options?.selector ?? "[data-reveal]"
    const targets = root.querySelectorAll<HTMLElement>(selector)
    if (!targets.length) return

    const cleanup: Array<() => void> = []
    targets.forEach((el, i) => {
      const anim = animate(el, {
        opacity: [0, 1],
        translateY: [40, 0],
        filter: ["blur(8px)", "blur(0px)"],
        scale: [0.96, 1],
        duration: 1000,
        ease: "out(4)",
        ...options?.params,
        delay:
          (options?.startDelay ?? 0) + i * (options?.staggerMs ?? 90),
        autoplay: onScroll({
          target: el,
          enter: "bottom-=80",
          leave: "top-=200",
          repeat: options?.repeat ?? false,
        }),
      })
      cleanup.push(() => anim.revert?.())
    })

    return () => cleanup.forEach((fn) => fn())
  }, [options])

  return containerRef
}

/** Trigger an animation once when the parent ref enters the viewport. */
export function useScrollTrigger<T extends HTMLElement = HTMLDivElement>(
  build: (targets: T) => void,
) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            build(el)
            observer.disconnect()
          }
        })
      },
      { rootMargin: "0px 0px -120px 0px", threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [build])

  return ref
}

export { stagger }
