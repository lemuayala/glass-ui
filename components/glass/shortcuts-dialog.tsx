"use client"

import { useEffect } from "react"
import { Keyboard, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useT } from "@/lib/i18n/provider"

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd
      className={cn(
        "inline-flex h-6 min-w-6 items-center justify-center rounded-md px-1.5",
        "border border-border bg-background/60",
        "font-mono text-[10px] font-medium text-foreground",
        "shadow-[inset_0_-1px_0_0_var(--gg-glass-inset-dark)]",
      )}
    >
      {children}
    </kbd>
  )
}

export function ShortcutsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useT()

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null

  const rows: { label: string; keys: React.ReactNode }[] = [
    {
      label: t("shortcuts.components"),
      keys: (
        <div className="flex items-center gap-1">
          <Kbd>1</Kbd>
          <Kbd>2</Kbd>
          <Kbd>3</Kbd>
          <Kbd>4</Kbd>
          <Kbd>5</Kbd>
        </div>
      ),
    },
    { label: t("shortcuts.theme"), keys: <Kbd>D</Kbd> },
    { label: t("shortcuts.appTheme"), keys: <Kbd>T</Kbd> },
    { label: t("shortcuts.locale"), keys: <Kbd>L</Kbd> },
    {
      label: t("shortcuts.presets"),
      keys: (
        <div className="flex items-center gap-1">
          <Kbd>P</Kbd>
          <span className="text-muted-foreground">or</span>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </div>
      ),
    },
    { label: t("shortcuts.share"), keys: <Kbd>S</Kbd> },
    { label: t("shortcuts.close"), keys: <Kbd>Esc</Kbd> },
  ]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-md" onClick={onClose} aria-hidden />
      <div className="gg-glass gg-glass-inset relative w-full max-w-md rounded-3xl p-6">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="mb-5 flex items-center gap-2">
          <Keyboard className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            {t("shortcuts.title")}
          </h2>
        </div>
        <ul className="space-y-3">
          {rows.map((row) => (
            <li key={row.label} className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">{row.label}</span>
              {row.keys}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
