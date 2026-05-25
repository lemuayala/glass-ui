"use client"

import { forwardRef, useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { Share2, Sun, Moon, Languages, Keyboard } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { PresetsMenu } from "./presets-menu"
import type { GlassPreset } from "@/lib/glass-core/presets"
import type { ComponentKind, GlassOptions } from "@/lib/glass-core/types"
import { useI18n, useT } from "@/lib/i18n/provider"
import { SITE } from "@/lib/config"
import { BrandLockup } from "./brand-lockup"
import { GitHubStarLink } from "./github-star-link"
import { playgroundSegmentItem, playgroundSegmentShell } from "./playground-mobile-tabs"

const COMPONENT_KEYS: ComponentKind[] = [
  "glass-card",
  "glass-button",
  "glass-input",
  "glass-modal",
  "glass-tabbar",
  "glass-switch",
  "glass-navbar",
]

const COMPONENT_LABEL_KEY: Record<ComponentKind, string> = {
  "glass-card": "nav.card",
  "glass-button": "nav.button",
  "glass-input": "nav.input",
  "glass-modal": "nav.modal",
  "glass-tabbar": "nav.tabbar",
  "glass-switch": "nav.switch",
  "glass-navbar": "nav.navbar",
}

export const Header = forwardRef<
  { openPresets: () => void },
  {
    component: ComponentKind
    onComponent: (id: ComponentKind) => void
    options: GlassOptions
    onApplyPreset: (preset: GlassPreset) => void
    shareUrl: string
    presetsOpen: boolean
    onPresetsOpenChange: (open: boolean) => void
    onShowShortcuts: () => void
  }
>(function Header(
  {
    component,
    onComponent,
    options,
    onApplyPreset,
    shareUrl,
    presetsOpen,
    onPresetsOpenChange,
    onShowShortcuts,
  },
  _ref,
) {
  const t = useT()
  const { locale, toggleLocale } = useI18n()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === "dark"

  const handleShare = async () => {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success(t("share.toast.title"), {
        description: t("share.toast.description"),
        action: {
          label: t("share.toast.action"),
          onClick: () => window.open(shareUrl, "_blank"),
        },
      })
    } catch {
      /* clipboard might be blocked — fail silently */
    }
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-2 border-b border-border bg-background/90 px-3 py-2 backdrop-blur-none max-lg:bg-background/90 lg:bg-background/60 lg:backdrop-blur-xl sm:gap-3 sm:px-4 sm:py-3 md:px-6">
      <BrandLockup href="/" logoSize={28} className="min-w-0 flex-1 sm:flex-none" />

      {/* Component pills */}
      <nav className="hidden max-w-[52vw] items-center gap-0.5 overflow-x-auto rounded-full border border-border bg-foreground/[0.03] p-1 lg:flex xl:max-w-none">
        {COMPONENT_KEYS.map((id) => {
          const active = id === component
          return (
            <button
              key={id}
              type="button"
              onClick={() => onComponent(id)}
              className={cn(
                "relative rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200",
                active
                  ? "bg-foreground/10 text-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {/* @ts-expect-error - keys are statically defined */}
              {t(COMPONENT_LABEL_KEY[id])}
            </button>
          )
        })}
      </nav>

      {/* Actions — icon-first on mobile */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
        <PresetsMenu
          onApply={onApplyPreset}
          current={options}
          open={presetsOpen}
          onOpenChange={onPresetsOpenChange}
        />

        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleShare}
                aria-label={t("actions.share")}
                className="hidden h-8 items-center gap-1.5 rounded-full border border-border bg-foreground/[0.03] px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground md:flex"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>{t("actions.share")}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={8}>
              {`${t("actions.share")} (S)`}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="hidden h-5 w-px bg-border lg:block" aria-hidden />

        <IconBtn
          className="hidden md:flex"
          ariaLabel={t("actions.shortcuts")}
          tooltip={`${t("actions.shortcuts")} (?)`}
          onClick={onShowShortcuts}
        >
          <Keyboard className="h-3.5 w-3.5" />
        </IconBtn>

        <IconBtn
          ariaLabel={t("actions.locale")}
          tooltip={`${t("actions.locale")} (L)`}
          onClick={toggleLocale}
        >
          <Languages className="hidden h-3.5 w-3.5 sm:block" />
          <span className="text-[10px] font-semibold uppercase tracking-wider">{locale}</span>
        </IconBtn>

        <IconBtn
          ariaLabel={isDark ? t("actions.theme.light") : t("actions.theme.dark")}
          tooltip={`${isDark ? t("actions.theme.light") : t("actions.theme.dark")} (T)`}
          onClick={() => setTheme(isDark ? "light" : "dark")}
        >
          {!mounted ? (
            <Sun className="h-3.5 w-3.5" />
          ) : isDark ? (
            <Sun className="h-3.5 w-3.5" />
          ) : (
            <Moon className="h-3.5 w-3.5" />
          )}
        </IconBtn>

        <GitHubStarLink compact />
      </div>
    </header>
  )
})

function IconBtn({
  children,
  onClick,
  ariaLabel,
  tooltip,
  className,
}: {
  children: React.ReactNode
  onClick: () => void
  ariaLabel: string
  tooltip: string
  className?: string
}) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={onClick}
            aria-label={ariaLabel}
            className={cn(
              "flex h-8 min-w-8 items-center justify-center rounded-full border border-border bg-foreground/[0.03] px-2 text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground",
              className,
            )}
          >
            {children}
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={8}>
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

/* --------------------------------------------------------------
 * Mobile component switcher — same segmented glass as panel tabs.
 * ------------------------------------------------------------ */
export function ComponentSwitcherMobile({
  component,
  onComponent,
}: {
  component: ComponentKind
  onComponent: (id: ComponentKind) => void
}) {
  const t = useT()

  return (
    <nav
      role="tablist"
      aria-label={t("play.componentPicker")}
      className={cn("flex shrink-0 flex-col gap-1 lg:hidden", playgroundSegmentShell)}
    >
      <div className="grid grid-cols-4 gap-1">
        {COMPONENT_KEYS.slice(0, 4).map((id) => {
          const active = id === component
          return (
            <button
              key={id}
              type="button"
              role="tab"
              id={`play-component-${id}`}
              aria-selected={active}
              aria-controls="playground-preview"
              onClick={() => onComponent(id)}
              className={playgroundSegmentItem(
                active,
                "flex min-h-9 items-center justify-center px-1 py-2 text-center leading-tight",
              )}
            >
              {/* @ts-expect-error - keys are statically defined */}
              {t(COMPONENT_LABEL_KEY[id])}
            </button>
          )
        })}
      </div>
      <div className="grid grid-cols-3 gap-1">
        {COMPONENT_KEYS.slice(4).map((id) => {
          const active = id === component
          return (
            <button
              key={id}
              type="button"
              role="tab"
              id={`play-component-${id}`}
              aria-selected={active}
              aria-controls="playground-preview"
              onClick={() => onComponent(id)}
              className={playgroundSegmentItem(
                active,
                "flex min-h-9 items-center justify-center px-1 py-2 text-center leading-tight",
              )}
            >
              {/* @ts-expect-error - keys are statically defined */}
              {t(COMPONENT_LABEL_KEY[id])}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
