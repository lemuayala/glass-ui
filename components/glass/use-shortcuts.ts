"use client"

import { useEffect } from "react"

interface ShortcutHandlers {
  onComponentByIndex: (index: number) => void
  onToggleComponentTheme: () => void
  onTogglePresets: () => void
  onShare: () => void
  onToggleLocale: () => void
  onToggleAppTheme: () => void
  onShowHelp: () => void
}

/**
 * Registers app-wide keyboard shortcuts.
 *
 *   1 / 2 / 3 / 4 / 5  → switch component
 *   D                  → toggle component (preview) theme
 *   T                  → toggle app theme (light/dark)
 *   L                  → toggle language (es/en)
 *   P or Cmd/Ctrl+K    → open presets
 *   S                  → copy share link
 *   ?                  → show shortcuts dialog
 *
 * Shortcuts are ignored while the user is typing in an input/textarea.
 */
export function useShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    function isEditable(target: EventTarget | null) {
      if (!(target instanceof HTMLElement)) return false
      const tag = target.tagName
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true
      if (target.isContentEditable) return true
      return false
    }

    function onKey(e: KeyboardEvent) {
      // Cmd/Ctrl+K opens presets even from inputs
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        handlers.onTogglePresets()
        return
      }
      if (isEditable(e.target)) return
      if (e.metaKey || e.ctrlKey || e.altKey) return

      switch (e.key) {
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
          e.preventDefault()
          handlers.onComponentByIndex(Number(e.key) - 1)
          break
        case "d":
        case "D":
          e.preventDefault()
          handlers.onToggleComponentTheme()
          break
        case "t":
        case "T":
          e.preventDefault()
          handlers.onToggleAppTheme()
          break
        case "l":
        case "L":
          e.preventDefault()
          handlers.onToggleLocale()
          break
        case "p":
        case "P":
          e.preventDefault()
          handlers.onTogglePresets()
          break
        case "s":
        case "S":
          e.preventDefault()
          handlers.onShare()
          break
        case "?":
          e.preventDefault()
          handlers.onShowHelp()
          break
      }
    }

    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [handlers])
}
