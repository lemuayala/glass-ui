"use client"

import { forwardRef, useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import {
  Github,
  Sparkles,
  Share2,
  Star,
  Sun,
  Moon,
  Languages,
  Keyboard,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { PresetsMenu } from "./presets-menu"
import type { GlassPreset } from "@/lib/glass-core/presets"
import type { ComponentKind, GlassOptions } from "@/lib/glass-core/types"
import { useI18n, useT } from "@/lib/i18n/provider"
import { GITHUB_REPO_URL, parseGitHubRepo, SITE } from "@/lib/config"

const COMPONENT_KEYS: ComponentKind[] = [
  "glass-card",
  "glass-button",
  "glass-input",
  "glass-modal",
  "glass-tabbar",
]

const COMPONENT_LABEL_KEY: Record<ComponentKind, string> = {
  "glass-card": "nav.card",
  "glass-button": "nav.button",
  "glass-input": "nav.input",
  "glass-modal": "nav.modal",
  "glass-tabbar": "nav.tabbar",
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
  const [stars, setStars] = useState<number | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const repo = parseGitHubRepo(GITHUB_REPO_URL)
    if (!repo) return
    const ctrl = new AbortController()
    fetch(`https://api.github.com/repos/${repo.owner}/${repo.repo}`, {
      signal: ctrl.signal,
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && typeof data.stargazers_count === "number") {
          setStars(data.stargazers_count)
        }
      })
      .catch(() => {})
    return () => ctrl.abort()
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

  const formatStars = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(n)

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border bg-background/60 px-4 py-3 backdrop-blur-xl md:px-6">
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary to-primary/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3)]">
          <Sparkles className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-sm font-semibold tracking-tight">{SITE.name}</span>
          <span className="text-[10px] font-medium text-muted-foreground">{t("brand.tagline")}</span>
        </div>
      </div>

      {/* Component pills */}
      <nav className="hidden items-center gap-0.5 rounded-full border border-border bg-foreground/[0.03] p-1 lg:flex">
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

      {/* Actions */}
      <div className="flex items-center gap-1.5">
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
                className="flex h-8 items-center gap-1.5 rounded-full border border-border bg-foreground/[0.03] px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t("actions.share")}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={8}>
              {`${t("actions.share")} (S)`}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Divider */}
        <div className="hidden h-5 w-px bg-border md:block" aria-hidden />

        <IconBtn
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
          <Languages className="h-3.5 w-3.5" />
          <span className="ml-1 text-[10px] font-semibold uppercase tracking-wider">
            {locale}
          </span>
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

        <a
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noreferrer"
          aria-label={t("actions.star")}
          className="flex h-8 items-center gap-1.5 rounded-full border border-border bg-foreground/[0.03] px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
        >
          <Github className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{t("actions.star")}</span>
          {stars !== null && (
            <span className="hidden items-center gap-0.5 sm:flex">
              <Star className="h-3 w-3 fill-current" strokeWidth={0} />
              <span className="tabular-nums">{formatStars(stars)}</span>
            </span>
          )}
        </a>
      </div>
    </header>
  )
})

function IconBtn({
  children,
  onClick,
  ariaLabel,
  tooltip,
}: {
  children: React.ReactNode
  onClick: () => void
  ariaLabel: string
  tooltip: string
}) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={onClick}
            aria-label={ariaLabel}
            className="flex h-8 min-w-8 items-center justify-center rounded-full border border-border bg-foreground/[0.03] px-2 text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
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
 * Mobile component switcher — render under the header on small screens.
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
    <div className="lg:hidden">
      <div className="gg-scroll flex items-center gap-1 overflow-x-auto rounded-full border border-border bg-foreground/[0.03] p-1">
        {COMPONENT_KEYS.map((id) => {
          const active = id === component
          return (
            <button
              key={id}
              type="button"
              onClick={() => onComponent(id)}
              className={cn(
                "relative shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200",
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
      </div>
    </div>
  )
}
