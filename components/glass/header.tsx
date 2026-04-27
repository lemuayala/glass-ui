"use client"

import { Github, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ComponentKind } from "@/lib/glass-core/codegen"

const COMPONENTS: { id: ComponentKind; label: string; soon?: boolean }[] = [
  { id: "glass-card", label: "Card" },
  { id: "glass-button", label: "Button" },
  { id: "glass-input", label: "Input" },
]

export function Header({
  component,
  onComponent,
}: {
  component: ComponentKind
  onComponent: (id: ComponentKind) => void
}) {
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
      <nav className="hidden items-center gap-1 rounded-full border border-white/5 bg-white/[0.03] p-1 md:flex">
        {COMPONENTS.map((c) => {
          const active = c.id === component
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => !c.soon && onComponent(c.id)}
              disabled={c.soon}
              className={cn(
                "relative rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200",
                active && "bg-white/10 text-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]",
                !active && !c.soon && "text-muted-foreground hover:text-foreground",
                c.soon && "cursor-not-allowed text-muted-foreground/50",
              )}
            >
              {c.label}
              {c.soon && (
                <span className="ml-1.5 rounded-full bg-white/10 px-1.5 py-px text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Soon
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="flex h-8 items-center gap-2 rounded-full border border-white/5 bg-white/[0.03] px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
        >
          <Github className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Star</span>
        </a>
      </div>
    </header>
  )
}
