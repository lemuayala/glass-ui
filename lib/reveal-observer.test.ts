import { afterEach, describe, expect, it, vi } from "vitest"

type Entry = { target: Element; isIntersecting: boolean; boundingClientRect: { top: number } }

/** Minimal IntersectionObserver double that lets the test deliver entries. */
class FakeIO {
  static instance: FakeIO | null = null
  observed = new Set<Element>()
  constructor(public cb: (entries: Entry[]) => void) {
    FakeIO.instance = this
  }
  observe(el: Element) {
    this.observed.add(el)
  }
  unobserve(el: Element) {
    this.observed.delete(el)
  }
  disconnect() {}
  emit(entries: Entry[]) {
    this.cb(entries)
  }
}

async function load() {
  vi.resetModules()
  return import("./reveal-observer")
}

afterEach(() => {
  vi.unstubAllGlobals()
  FakeIO.instance = null
})

describe("observeReveal", () => {
  it("shows immediately when IntersectionObserver is unavailable", async () => {
    vi.stubGlobal("IntersectionObserver", undefined)
    const { observeReveal, markShown } = await load()
    const el = document.createElement("div")
    observeReveal(el, markShown)
    expect(el.hasAttribute("data-shown")).toBe(true)
  })

  it("shows once on entering the viewport, then stops observing", async () => {
    vi.stubGlobal("IntersectionObserver", FakeIO)
    const { observeReveal } = await load()
    const el = document.createElement("div")
    const onShow = vi.fn()
    observeReveal(el, onShow)
    const io = FakeIO.instance!

    io.emit([{ target: el, isIntersecting: false, boundingClientRect: { top: 900 } }])
    expect(onShow).not.toHaveBeenCalled()

    io.emit([{ target: el, isIntersecting: true, boundingClientRect: { top: 300 } }])
    expect(onShow).toHaveBeenCalledTimes(1)
    expect(io.observed.has(el)).toBe(false)
  })

  it("shows content that was scrolled or jumped past without ever intersecting", async () => {
    vi.stubGlobal("IntersectionObserver", FakeIO)
    const { observeReveal, markShown } = await load()
    const el = document.createElement("div")
    observeReveal(el, markShown)
    FakeIO.instance!.emit([{ target: el, isIntersecting: false, boundingClientRect: { top: -400 } }])
    expect(el.hasAttribute("data-shown")).toBe(true)
  })

  it("cleanup stops observing an element that never showed", async () => {
    vi.stubGlobal("IntersectionObserver", FakeIO)
    const { observeReveal } = await load()
    const el = document.createElement("div")
    const stop = observeReveal(el, vi.fn())
    stop()
    expect(FakeIO.instance!.observed.has(el)).toBe(false)
  })
})
