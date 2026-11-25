import { act, renderHook } from "@testing-library/react"
import React from "react"
import { beforeEach, describe, expect, it } from "vitest"
import { SITE } from "@/lib/config"
import { dictionaries } from "./dictionaries"
import { I18nProvider, useI18n, useT } from "./provider"

describe("i18n dictionaries & provider", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it("maintains strict 1:1 key parity between English and Spanish", () => {
    const enKeys = Object.keys(dictionaries.en).sort()
    const esKeys = Object.keys(dictionaries.es).sort()
    expect(esKeys).toEqual(enKeys)
  })

  it("has no empty or whitespace-only values in any locale", () => {
    for (const [locale, dict] of Object.entries(dictionaries)) {
      for (const [key, value] of Object.entries(dict)) {
        expect(value.trim().length, `Empty translation for ${locale}.${key}`).toBeGreaterThan(0)
      }
    }
  })

  it("keeps landing badge version aligned with SITE.version", () => {
    expect(dictionaries.en["landing.badge"]).toContain(`v${SITE.version}`)
    expect(dictionaries.es["landing.badge"]).toContain(`v${SITE.version}`)
  })

  it("toggles locale and persists preference in localStorage", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(I18nProvider, null, children)

    const { result } = renderHook(
      () => ({ i18n: useI18n(), t: useT() }),
      { wrapper },
    )

    const initialLocale = result.current.i18n.locale
    act(() => {
      result.current.i18n.setLocale("es")
    })
    expect(result.current.i18n.locale).toBe("es")
    expect(result.current.t("actions.share")).toBe("Compartir")
    expect(window.localStorage.getItem("glass-ui-locale")).toBe("es")

    act(() => {
      result.current.i18n.toggleLocale()
    })
    expect(result.current.i18n.locale).toBe("en")
    expect(result.current.t("actions.share")).toBe("Share")
    expect(["en", "es"]).toContain(initialLocale)
  })
})
