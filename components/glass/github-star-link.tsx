"use client"

import { Github, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { GITHUB_REPO_URL } from "@/lib/config"
import { useT } from "@/lib/i18n/provider"
import { formatGitHubStars, useGitHubStars } from "@/hooks/use-github-stars"

type GitHubStarLinkProps = {
  className?: string
  /** Icon-only pill in the landing header */
  compact?: boolean
}

export function GitHubStarLink({ className, compact = false }: GitHubStarLinkProps) {
  const t = useT()
  const stars = useGitHubStars()

  return (
    <a
      href={GITHUB_REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("actions.star")}
      className={cn(
        "flex items-center justify-center rounded-full border border-border bg-foreground/[0.03] text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground",
        compact ? "h-8 gap-1.5 px-2.5" : "h-8 gap-1.5 px-3 text-xs font-medium",
        className,
      )}
    >
      <Github className="h-3.5 w-3.5 shrink-0" />
      {!compact && <span className="hidden sm:inline">{t("actions.star")}</span>}
      {stars !== null && (
        <span className={cn("flex items-center gap-0.5", compact ? "text-[11px] font-medium" : "")}>
          <Star className="h-3 w-3 fill-current" strokeWidth={0} />
          <span className="tabular-nums">{formatGitHubStars(stars)}</span>
        </span>
      )}
    </a>
  )
}
