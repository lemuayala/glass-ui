"use client"

import { cn } from "@/lib/utils"

export interface SegmentedOption<T extends string> {
  value: T
  label: string
}

export function Segmented<T extends string>({
  label,
  description,
  options,
  value,
  onChange,
  size = "md",
}: {
  label: string
  description?: string
  options: SegmentedOption<T>[]
  value: T
  onChange: (v: T) => void
  size?: "sm" | "md"
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label>
        {description && <span className="text-[10px] text-muted-foreground/70">{description}</span>}
      </div>
      <div
        role="radiogroup"
        aria-label={label}
        className={cn(
          "relative grid gap-0.5 rounded-xl border border-border bg-foreground/[0.03] p-0.5 shadow-[inset_0_1px_0_0_var(--gg-glass-inset-light)]",
        )}
        style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
      >
        {options.map((opt) => {
          const active = opt.value === value
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(opt.value)}
              className={cn(
                "relative rounded-[10px] font-medium transition-all duration-200",
                size === "md" ? "px-2.5 py-2 text-xs" : "px-2 py-1.5 text-[11px]",
                active
                  ? "bg-foreground/10 text-foreground shadow-[inset_0_1px_0_0_var(--gg-glass-inset-light),0_1px_2px_0_var(--gg-glass-inset-dark)]"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
