"use client"

import { useEffect, useRef, useState } from "react"
import { Wand2, Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { PRESETS, type GlassPreset } from "@/lib/glass-core/presets"
import type { GlassOptions } from "@/lib/glass-core/types"

/**
 * Curated presets dropdown. One click sets every option except `text`,
 * which is preserved so the user's custom label/title stays.
 */
export function PresetsMenu({
  onApply,
  current,
}: {
  onApply: (preset: GlassPreset) => void
  current: GlassOptions
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onDoc(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDoc)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  // A preset is "active" when every option (except text) matches the current state.
  const matches = (p: GlassPreset) =>
    (Object.keys(p.options) as (keyof GlassOptions)[]).every((k) => {
      if (k === "text") return true
      return p.options[k] === current[k]
    })

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "flex h-8 items-center gap-1.5 rounded-full border border-white/5 bg-white/[0.03] px-3 text-xs font-medium transition-colors",
          "hover:bg-white/[0.06] hover:text-foreground",
          open ? "text-foreground" : "text-muted-foreground",
        )}
      >
        <Wand2 className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Presets</span>
        <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-[280px] origin-top-right rounded-2xl border border-white/10 bg-[#0e1119]/95 p-1.5 shadow-2xl backdrop-blur-xl"
        >
          <div className="px-3 pb-1.5 pt-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Curated styles
            </p>
          </div>
          <div className="space-y-0.5">
            {PRESETS.map((preset) => {
              const active = matches(preset)
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    onApply(preset)
                    setOpen(false)
                  }}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                    "hover:bg-white/[0.06]",
                    active && "bg-white/[0.04]",
                  )}
                >
                  <PresetSwatch preset={preset} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{preset.name}</span>
                      {active && <Check className="h-3.5 w-3.5 text-primary" />}
                    </div>
                    <p className="mt-0.5 truncate text-[11px] leading-tight text-muted-foreground">
                      {preset.description}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

/** Tiny live-rendered glass chip representing the preset. */
function PresetSwatch({ preset }: { preset: GlassPreset }) {
  const o = preset.options
  const tintBg: Record<string, string> = {
    none: o.theme === "dark" ? "bg-white/15" : "bg-white/40",
    blue: "bg-blue-500/35",
    pink: "bg-pink-500/35",
    orange: "bg-orange-500/40",
    teal: "bg-teal-500/35",
  }
  const wrapperBg: Record<string, string> = {
    frosted: "bg-gradient-to-br from-sky-200 via-pink-200 to-amber-200",
    liquid: "bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-rose-500",
    smoked: "bg-gradient-to-br from-zinc-700 via-zinc-900 to-black",
    crystal: "bg-gradient-to-br from-emerald-200 via-teal-200 to-sky-200",
    sunset: "bg-gradient-to-br from-orange-400 via-rose-400 to-fuchsia-500",
    aqua: "bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500",
  }
  return (
    <div
      className={cn(
        "relative h-10 w-10 shrink-0 overflow-hidden rounded-xl",
        wrapperBg[preset.id] ?? "bg-gradient-to-br from-zinc-600 to-zinc-900",
      )}
    >
      <div
        className={cn(
          "absolute inset-1 rounded-lg backdrop-blur-md",
          tintBg[o.tint],
          o.border !== "none" && (o.theme === "dark" ? "border border-white/15" : "border border-white/40"),
        )}
      />
    </div>
  )
}
