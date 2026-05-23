"use client"

import Link from "next/link"
import { useT } from "@/lib/i18n/provider"
import { SITE_AUTHOR } from "@/lib/config"
import { cn } from "@/lib/utils"

export function SiteFooterCredit({ className }: { className?: string }) {
  const t = useT()

  return (
    <p className={cn("text-[11px] text-muted-foreground", className)}>
      {t("footer.madeBy")}{" "}
      <Link
        href={SITE_AUTHOR.github}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-foreground/85 underline-offset-2 transition-colors hover:text-foreground hover:underline"
      >
        {SITE_AUTHOR.name}
      </Link>
    </p>
  )
}
