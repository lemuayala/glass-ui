"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { GITHUB_REPO_URL } from "@/lib/config"
import { useT } from "@/lib/i18n/provider"
import { formatGitHubStars, useGitHubStars } from "@/hooks/use-github-stars"

function GitHubMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

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
      <GitHubMark className="h-3.5 w-3.5 shrink-0" />
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
