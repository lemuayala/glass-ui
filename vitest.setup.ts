import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"
import { afterEach, vi } from "vitest"

afterEach(() => {
  cleanup()
})

if (typeof window !== "undefined") {
  // Node 22+ defines an experimental global localStorage stub when --localstorage-file is omitted.
  // Provide a spec-compliant in-memory Storage for deterministic tests.
  const createMemoryStorage = (): Storage => {
    const store = new Map<string, string>()
    return {
      get length() {
        return store.size
      },
      clear() {
        store.clear()
      },
      getItem(key: string) {
        return store.has(key) ? (store.get(key) ?? null) : null
      },
      key(index: number) {
        return Array.from(store.keys())[index] ?? null
      },
      removeItem(key: string) {
        store.delete(key)
      },
      setItem(key: string, value: string) {
        store.set(String(key), String(value))
      },
    }
  }

  const memoryLocalStorage = createMemoryStorage()
  Object.defineProperty(window, "localStorage", {
    writable: true,
    configurable: true,
    value: memoryLocalStorage,
  })
  Object.defineProperty(globalThis, "localStorage", {
    writable: true,
    configurable: true,
    value: memoryLocalStorage,
  })

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })

  class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | Document | null = null
    readonly rootMargin: string = ""
    readonly thresholds: ReadonlyArray<number> = []
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
    takeRecords = vi.fn(() => [])
  }

  class MockResizeObserver implements ResizeObserver {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
  }

  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  })

  Object.defineProperty(window, "ResizeObserver", {
    writable: true,
    configurable: true,
    value: MockResizeObserver,
  })

  if (!URL.createObjectURL) {
    URL.createObjectURL = vi.fn(() => "blob:glass-ui-test")
  }
  if (!URL.revokeObjectURL) {
    URL.revokeObjectURL = vi.fn()
  }
}
