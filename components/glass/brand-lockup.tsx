"use client"

import Link from "next/link"
import { SITE } from "@/lib/config"
import { useT } from "@/lib/i18n/provider"
import { cn } from "@/lib/utils"
import { BrandLogo } from "./brand-logo"

export function BrandLockup({
  href = "/",
  logoSize = 32,
  priority = false,
  className,
}: {
  href?: string
  logoSize?: number
  priority?: boolean
  className?: string
}) {
  const t = useT()

  return (
    <Link
      href={href}
      className={cn("flex min-w-0 items-center gap-2 transition-opacity hover:opacity-90 sm:gap-2.5", className)}
    >
      <BrandLogo size={logoSize} priority={priority} className="shrink-0" />
      <div className="min-w-0 leading-tight hidden sm:block">
        <p className="truncate text-sm font-semibold tracking-tight">{SITE.name}</p>
        <p className="hidden truncate text-[10px] font-medium text-muted-foreground sm:block">
          {t("brand.tagline")}
        </p>
      </div>
    </Link>
  )
}
