"use client"

import { Code2, Eye, Sliders } from "lucide-react"
import { cn } from "@/lib/utils"
import { useT } from "@/lib/i18n/provider"

export type PlaygroundMobilePanel = "controls" | "preview" | "code"

/** Shared segmented control shell (playground mobile toolbars). */
export const playgroundSegmentShell =
  "rounded-xl border border-border bg-foreground/[0.03] p-1 shadow-[inset_0_1px_0_0_var(--gg-glass-inset-light)]"

export function playgroundSegmentItem(active: boolean, className?: string) {
  return cn(
    "touch-manipulation rounded-[10px] text-[11px] font-medium transition-all duration-200",
    active
      ? "bg-foreground/10 text-foreground shadow-[inset_0_1px_0_0_var(--gg-glass-inset-light)]"
      : "text-muted-foreground hover:text-foreground",
    className,
  )
}

const PANELS: {
  id: PlaygroundMobilePanel
  labelKey: "panel.properties" | "panel.preview" | "panel.code"
  Icon: typeof Sliders
}[] = [
  { id: "preview", labelKey: "panel.preview", Icon: Eye },
  { id: "controls", labelKey: "panel.properties", Icon: Sliders },
  { id: "code", labelKey: "panel.code", Icon: Code2 },
]

export function PlaygroundMobileTabs({
  active,
  onChange,
}: {
  active: PlaygroundMobilePanel
  onChange: (panel: PlaygroundMobilePanel) => void
}) {
  const t = useT()

  return (
    <div
      className={cn("grid shrink-0 grid-cols-3 gap-1 lg:hidden", playgroundSegmentShell)}
      role="tablist"
      aria-label={t("play.mobile.tabs")}
    >
      {PANELS.map(({ id, labelKey, Icon }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(id)}
            className={playgroundSegmentItem(isActive, "flex items-center justify-center gap-1.5 px-2 py-2.5")}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2.2} />
            <span className="truncate">{t(labelKey)}</span>
          </button>
        )
      })}
    </div>
  )
}

export function playgroundPanelClass(
  panel: PlaygroundMobilePanel,
  active: PlaygroundMobilePanel,
): string {
  return cn(
    "flex min-h-0 flex-col overflow-hidden",
    active === panel ? "max-lg:flex max-lg:min-h-0 max-lg:flex-1" : "max-lg:hidden",
    "lg:flex lg:flex-1",
  )
}
