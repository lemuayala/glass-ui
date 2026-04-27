"use client"

import { useState } from "react"
import { Github, Sparkles, Share2, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { PresetsMenu } from "./presets-menu"
import type { GlassPreset } from "@/lib/glass-core/presets"
import type { ComponentKind, GlassOptions } from "@/lib/glass-core/types"

const COMPONENTS: { id: ComponentKind; label: string }[] = [
  { id: "glass-card", label: "Card" },
  { id: "glass-button", label: "Button" },
  { id: "glass-input", label: "Input" },
  { id: "glass-modal", label: "Modal" },
  { id: "glass-tabbar", label: "Tab Bar" },
]

export function Header({
  component,
  onComponent,
  options,
  onApplyPreset,
  shareUrl,
}: {
  component: ComponentKind
  onComponent: (id: ComponentKind) => void
  options: GlassOptions
  onApplyPreset: (preset: GlassPreset) => void
  shareUrl: string
}) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard might be blocked — fail silently */
    }
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-white/5 bg-background/60 px-4 py-3 backdrop-blur-xl md:px-6">
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary to-primary/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3)]">
          <Sparkles className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-sm font-semibold tracking-tight">Glass UI</span>
          <span className="text-[10px] font-medium text-muted-foreground">Glassmorphism Generator</span>
        </div>
      </div>

      {/* Component pills */}
      <nav className="hidden items-center gap-0.5 rounded-full border border-white/5 bg-white/[0.03] p-1 lg:flex">
        {COMPONENTS.map((c) => {
          const active = c.id === component
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onComponent(c.id)}
              className={cn(
                "relative rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200",
                active
                  ? "bg-white/10 text-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {c.label}
            </button>
          )
        })}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <PresetsMenu onApply={onApplyPreset} current={options} />

        <button
          type="button"
          onClick={handleShare}
          aria-label="Copy shareable URL"
          className={cn(
            "flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors",
            copied
              ? "border-primary/40 bg-primary/15 text-primary"
              : "border-white/5 bg-white/[0.03] text-muted-foreground hover:bg-white/[0.06] hover:text-foreground",
          )}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
          <span className="hidden sm:inline">{copied ? "Copied" : "Share"}</span>
        </button>

        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="flex h-8 items-center gap-1.5 rounded-full border border-white/5 bg-white/[0.03] px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
        >
          <Github className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Star</span>
        </a>
      </div>
    </header>
  )
}

/* --------------------------------------------------------------
 * Mobile component switcher — render under the header on small screens.
 * Exposed separately so the header stays compact.
 * ------------------------------------------------------------ */
export function ComponentSwitcherMobile({
  component,
  onComponent,
}: {
  component: ComponentKind
  onComponent: (id: ComponentKind) => void
}) {
  return (
    <div className="lg:hidden">
      <div className="gg-scroll flex items-center gap-1 overflow-x-auto rounded-full border border-white/5 bg-white/[0.03] p-1">
        {COMPONENTS.map((c) => {
          const active = c.id === component
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onComponent(c.id)}
              className={cn(
                "relative shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200",
                active
                  ? "bg-white/10 text-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {c.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
