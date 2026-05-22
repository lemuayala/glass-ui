"use client"

import { animate, createTimeline, onScroll, utils } from "animejs"

/**
 * Target top crosses viewport bottom edge → section just entered while scrolling down.
 * Works for footer blocks (CTA/stats); `top 90%` often never fires there.
 */
const SCROLL_ENTER = "top bottom-=10%"

export function setRevealPending(targets: unknown, y = 28) {
  utils.set(targets, {
    opacity: 0,
    translateY: y,
    filter: "blur(8px)",
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

export function isPartiallyVisible(el: HTMLElement) {
  const r = el.getBoundingClientRect()
  return r.top < window.innerHeight * 0.98 && r.bottom > 0
}

type EnterSceneOptions = {
  lockTargets?: () => unknown
  onComplete?: () => void
}

export function createEnterScene(section: HTMLElement, options?: EnterSceneOptions) {
  if (prefersReducedMotion()) {
    const targets = options?.lockTargets?.()
    if (targets) revealVisible(targets)
    options?.onComplete?.()
    return createTimeline({ autoplay: false })
  }

  let locked = false
  const finish = () => {
    if (locked) return
    locked = true
    const targets = options?.lockTargets?.()
    if (targets) revealVisible(targets)
    options?.onComplete?.()
  }

  const tl = createTimeline({
    autoplay: onScroll({
      target: section,
      enter: SCROLL_ENTER,
      repeat: false,
      sync: "play",
      onEnter: () => {
        if (!locked && tl.progress < 1) tl.play()
      },
    }),
    defaults: { ease: "out(4)" },
    onComplete: finish,
  })

  const tryPlay = () => {
    if (!locked && isPartiallyVisible(section) && tl.progress < 1) tl.play()
  }

  requestAnimationFrame(tryPlay)
  window.addEventListener("scroll", tryPlay, { passive: true })

  const origRevert = tl.revert?.bind(tl)
  tl.revert = () => {
    window.removeEventListener("scroll", tryPlay)
    origRevert?.()
  }

  return tl
}

/**
 * Scroll-driven assembly — progress only moves forward (never rewinds on scroll up).
 * After ~98% the scene locks and targets stay visible via revealVisible.
 */
export function createAssemblyScene(section: HTMLElement, options?: EnterSceneOptions) {
  if (prefersReducedMotion()) {
    const targets = options?.lockTargets?.()
    if (targets) revealVisible(targets)
    options?.onComplete?.()
    return createTimeline({ autoplay: false })
  }

  let locked = false
  /** Monotonic scroll progress — fixes appear/disappear when scrolling back up. */
  let maxProgress = 0

  const lock = () => {
    if (locked) return
    locked = true
    const targets = options?.lockTargets?.()
    if (targets) revealVisible(targets)
    tl.seek(tl.duration)
    options?.onComplete?.()
  }

  const holdLocked = () => {
    if (!locked) return
    const targets = options?.lockTargets?.()
    if (targets) revealVisible(targets)
    tl.seek(tl.duration)
  }

  const tl = createTimeline({
    autoplay: false,
    defaults: { ease: "out(4)", duration: 720 },
  })

  const syncFromScroll = () => {
    if (locked) {
      holdLocked()
      return
    }

    const rect = section.getBoundingClientRect()
    const vh = window.innerHeight
    if (rect.bottom < 0 || rect.top > vh) return

    const travel = Math.max(section.offsetHeight - vh * 0.35, vh * 0.95)
    const raw = Math.min(1, Math.max(0, (vh * 0.52 - rect.top) / travel))
    const progress = raw ** 1.35

    maxProgress = Math.max(maxProgress, progress)
    tl.seek(maxProgress * tl.duration)

    if (maxProgress >= 0.97) lock()
  }

  requestAnimationFrame(syncFromScroll)
  window.addEventListener("scroll", syncFromScroll, { passive: true })
  window.addEventListener("resize", syncFromScroll, { passive: true })

  const origRevert = tl.revert?.bind(tl)
  tl.revert = () => {
    window.removeEventListener("scroll", syncFromScroll)
    window.removeEventListener("resize", syncFromScroll)
    origRevert?.()
  }

  return tl
}

/** Count-up numbers after stats row is visible. */
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
