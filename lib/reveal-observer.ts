/**
 * One IntersectionObserver for every reveal on the page (Iron Fit landing pattern).
 *
 * An element is "shown" once, when it enters the viewport or ends up anywhere above it (scrolled or jumped
 * past), so a fast fling or an anchor link never leaves content hidden. Showing only sets `data-shown`;
 * CSS transitions do the motion on the compositor, with no JS animation loop.
 */
type OnShow = (el: Element) => void

const callbacks = new WeakMap<Element, OnShow>()
let observer: IntersectionObserver | null = null

function getObserver(): IntersectionObserver {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting && entry.boundingClientRect.top > 0) continue
        observer?.unobserve(entry.target)
        callbacks.get(entry.target)?.(entry.target)
        callbacks.delete(entry.target)
      }
    },
    // The root extends far above the viewport, so jumping past an element (fast fling, anchor link, End key)
    // still counts as an intersection change and reveals it; below, it waits until 10% into the viewport.
    { rootMargin: "1000000px 0px -10% 0px", threshold: 0 },
  )
  return observer
}

/** Calls `onShow` once when `el` enters (or has passed) the viewport. Returns a cleanup. */
export function observeReveal(el: Element, onShow: OnShow): () => void {
  if (typeof IntersectionObserver === "undefined") {
    onShow(el)
    return () => {}
  }
  callbacks.set(el, onShow)
  getObserver().observe(el)
  return () => {
    callbacks.delete(el)
    observer?.unobserve(el)
  }
}

export const markShown: OnShow = (el) => el.setAttribute("data-shown", "")
