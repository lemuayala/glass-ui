"use client"

import { ThemeProvider as NextThemes } from "next-themes"
import { Toaster } from "sonner"
import { I18nProvider } from "@/lib/i18n/provider"

/**
 * App-level providers: theme (light/dark/system), i18n, and toast root.
 *
 *  - next-themes handles the `dark`/`light` class on <html>
 *  - sonner renders toasts; we style them to feel native to the iOS theme
 *  - I18nProvider exposes `useI18n()` and `useT()` for translations
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemes attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <I18nProvider>
        {children}
        <Toaster
          position="top-center"
          theme="system"
          toastOptions={{
            classNames: {
              toast:
                "rounded-2xl border border-white/10 bg-card/95 backdrop-blur-xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)]",
              title: "text-sm font-semibold tracking-tight text-foreground",
              description: "text-xs text-muted-foreground leading-relaxed",
              actionButton:
                "rounded-full bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5",
              cancelButton: "rounded-full text-muted-foreground text-xs",
            },
          }}
        />
      </I18nProvider>
    </NextThemes>
  )
}
