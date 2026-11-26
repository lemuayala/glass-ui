"use client"

import { Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { NPM_PACKAGES, npmPackageUrl } from "@/lib/config"
import { useT } from "@/lib/i18n/provider"
import { formatCompactCount } from "@/lib/format-count"
import { useNpmPackage } from "@/hooks/use-npm-package"
import { NpmIcon } from "./npm-icon"

type NpmLinkProps = {
  className?: string
  /** Icon + stat pill in the landing header */
  compact?: boolean
}

/**
 * Header pill to the npm package page (mirrors GitHubStarLink).
 * Shows weekly downloads once npm has stats, otherwise the latest published version.
 */
export function NpmLink({ className, compact = false }: NpmLinkProps) {
  const t = useT()
  const { version, weeklyDownloads } = useNpmPackage(NPM_PACKAGES.core)
  const showDownloads = weeklyDownloads !== null && weeklyDownloads > 0

  return (
    <a
      href={npmPackageUrl(NPM_PACKAGES.core)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("actions.npm")}
      title={showDownloads ? t("actions.npmDownloads") : t("actions.npm")}
      className={cn(
        "flex items-center justify-center rounded-full border border-border bg-foreground/[0.03] text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground",
        compact ? "h-8 gap-1.5 px-2.5" : "h-8 gap-1.5 px-3 text-xs font-medium",
        className,
      )}
    >
      <NpmIcon />
      {!compact && <span className="hidden sm:inline">{t("actions.npm")}</span>}
      {showDownloads ? (
        <span className={cn("flex items-center gap-0.5", compact ? "text-[11px] font-medium" : "")}>
          <Download className="h-3 w-3" strokeWidth={2.4} />
          <span className="tabular-nums">{formatCompactCount(weeklyDownloads)}</span>
        </span>
      ) : (
        version && (
          <span className={cn("font-mono tabular-nums", compact ? "text-[11px] font-medium" : "")}>v{version}</span>
        )
      )}
    </a>
  )
}
