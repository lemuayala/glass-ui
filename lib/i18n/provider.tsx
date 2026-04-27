"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { dictionaries, LOCALES, type Locale, type TranslationKey } from "./dictionaries"

interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
  t: (key: TranslationKey) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

const STORAGE_KEY = "glass-ui-locale"

function detectInitial(): Locale {
  if (typeof window === "undefined") return "en"
  const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null
  if (stored && LOCALES.includes(stored)) return stored
  const nav = navigator.language?.slice(0, 2).toLowerCase()
  return nav === "es" ? "es" : "en"
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // Always start with "en" on first paint to avoid SSR/CSR mismatch,
  // then hydrate to the user's preferred locale on mount.
  const [locale, setLocaleState] = useState<Locale>("en")
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setLocaleState(detectInitial())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, locale)
    } catch {
      /* ignore */
    }
    document.documentElement.lang = locale
  }, [locale, hydrated])

  const setLocale = useCallback((next: Locale) => setLocaleState(next), [])
  const toggleLocale = useCallback(
    () => setLocaleState((curr) => (curr === "en" ? "es" : "en")),
    [],
  )

  const t = useCallback(
    (key: TranslationKey) => dictionaries[locale][key] ?? dictionaries.en[key] ?? key,
    [locale],
  )

  const value = useMemo<I18nContextValue>(
    () => ({ locale, setLocale, toggleLocale, t }),
    [locale, setLocale, toggleLocale, t],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used within <I18nProvider>")
  return ctx
}

/** Convenience hook for components that only need `t`. */
export function useT() {
  return useI18n().t
}
