"use client"

import { animate, createTimeline, utils } from "animejs"
import type { Timeline } from "animejs"

export const LANDING_REVEAL_EVENT = "glass:landing-reveal"

const REVEAL_IO: IntersectionObserverInit = {
  root: null,
  rootMargin: "0px 0px -8% 0px",
  threshold: [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.35, 0.45],
}

export type EnterTimeline = Timeline & {
  /** Call after all `scene.add()` — arms scroll observer */
  armReveal: () => void
}

export function requestLandingSectionReveal(sectionId: string) {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent(LANDING_REVEAL_EVENT, { detail: { id: sectionId } }))
}

export function setRevealPending(targets: unknown, y = 20) {
  utils.set(targets, {
    opacity: 0,
    translateY: y,
  })
}

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

export function revealVisible(targets: unknown) {
  utils.set(targets, {
    opacity: 1,
    translateY: 0,
    scale: 1,
    rotate: 0,
    translateX: 0,
    filter: "blur(0px)",
  })
}

/** Anchor intersects viewport while scrolling down (no upper band — avoids skip on fast scroll). */
export function isRevealTargetInView(el: HTMLElement): boolean {
  const r = el.getBoundingClientRect()
  const vh = window.innerHeight
  if (r.height <= 0) return false
  return r.top < vh * 0.82 && r.bottom > vh * 0.06
}

export type EnterSceneOptions = {
  lockTargets?: () => unknown
  onComplete?: () => void
  /** Element that marks “user reached this block” — usually the section h2 */
  anchor?: HTMLElement | (() => HTMLElement | null)
}

function resolveAnchor(section: HTMLElement, options?: EnterSceneOptions): HTMLElement {
  const raw = options?.anchor
  const el = typeof raw === "function" ? raw() : raw
  return el ?? section
}

function asEnterTimeline(tl: Timeline, armReveal: () => void): EnterTimeline {
  const extended = tl as EnterTimeline
  extended.armReveal = armReveal
  return extended
}

type RevealHandle = {
  disconnect: () => void
}

function armRevealObserver(
  anchor: HTMLElement,
  sectionId: string | undefined,
  onFire: () => void,
): RevealHandle {
  let fired = false

  const fire = () => {
    if (fired) return
    if (!isRevealTargetInView(anchor)) return
    fired = true
    onFire()
    handle.disconnect()
  }

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.target !== anchor) continue
      if (!entry.isIntersecting) continue
      if (entry.intersectionRatio < 0.08) continue
      fire()
    }
  }, REVEAL_IO)

  const onScroll = () => fire()

  const onRevealRequest = (e: Event) => {
    const id = (e as CustomEvent<{ id?: string }>).detail?.id
    if (sectionId && id && sectionId !== id) return
    requestAnimationFrame(fire)
  }

  const handle: RevealHandle = {
    disconnect: () => {
      observer.disconnect()
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("scrollend", onScroll)
      window.removeEventListener(LANDING_REVEAL_EVENT, onRevealRequest)
    },
  }

  observer.observe(anchor)
  window.addEventListener("scroll", onScroll, { passive: true })
  window.addEventListener("scrollend", onScroll, { passive: true })
  window.addEventListener(LANDING_REVEAL_EVENT, onRevealRequest)
  requestAnimationFrame(fire)

  return handle
}

function createDesktopScene(section: HTMLElement, options?: EnterSceneOptions): EnterTimeline {
  const anchor = resolveAnchor(section, options)
  const sectionId = section.id || undefined
  let locked = false
  let playing = false
  let played = false
  let handle: RevealHandle | null = null

  const finish = () => {
    if (locked) return
    locked = true
    playing = false
    const targets = options?.lockTargets?.()
    if (targets) revealVisible(targets)
    options?.onComplete?.()
  }

  const tl = createTimeline({
    autoplay: false,
    defaults: { ease: "out(4)" },
    onComplete: finish,
  })

  const play = () => {
    if (played || locked || playing) return
    if (tl.duration <= 0) {
      finish()
      return
    }
    played = true
    playing = true
    tl.pause()
    tl.seek(0)
    tl.play()
  }

  const armReveal = () => {
    if (handle) return
    handle = armRevealObserver(anchor, sectionId, play)
  }

  const emergency = window.setTimeout(() => {
    if (!played && !locked) {
      const targets = options?.lockTargets?.()
      if (targets) revealVisible(targets)
      options?.onComplete?.()
      locked = true
    }
  }, 15000)

  const origRevert = tl.revert?.bind(tl)
  tl.revert = () => {
    window.clearTimeout(emergency)
    handle?.disconnect()
    origRevert?.()
  }

  return asEnterTimeline(tl, armReveal)
}

export function createEnterScene(
  section: HTMLElement,
  options?: EnterSceneOptions,
): EnterTimeline {
  if (prefersReducedMotion()) {
    const targets = options?.lockTargets?.()
    if (targets) revealVisible(targets)
    options?.onComplete?.()
    const tl = createTimeline({ autoplay: false })
    return asEnterTimeline(tl, () => {})
  }

  return createDesktopScene(section, options)
}

export function animateStatCounters(counters: NodeListOf<HTMLElement> | HTMLElement[]) {
  const list = Array.from(counters as Iterable<HTMLElement>)
  list.forEach((el) => {
    const to = Number(el.dataset.counter || "0")
    const isPlus = el.dataset.suffix === "+"
    const obj = { val: 0 }
    animate(obj, {
      val: [0, to],
      duration: 1400,
      ease: "out(4)",
      autoplay: true,
      onUpdate: () => {
        el.textContent = utils.round(obj.val, 0).toLocaleString() + (isPlus ? "+" : "")
      },
      onComplete: () => {
        el.textContent = to.toLocaleString() + (isPlus ? "+" : "")
      },
    })
  })
}
