"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { useLandingLite } from "@/hooks/use-mobile"

type SiriCtaLinkProps = {
  href: string
  children: React.ReactNode
  className?: string
}

/**
 * Primary CTA with portfolio-style Siri conic border on hover.
 * @see lemuayala-portfolio `siri-glow`
 */
export function SiriCtaLink({ href, children, className }: SiriCtaLinkProps) {
  const lite = useLandingLite()

  const link = (
    <Link
      href={href}
      className={cn(
        "relative z-10 inline-flex items-center gap-2.5 rounded-full bg-foreground px-8 py-4 text-base font-semibold text-background",
        !lite &&
          "shadow-[0_10px_30px_-12px_oklch(0.7_0.18_250_/_0.45)] transition-[transform,box-shadow] duration-300 group-hover:shadow-[0_12px_36px_-10px_oklch(0.65_0.22_250_/_0.55)]",
        "active:scale-[0.97]",
        "group",
        className,
      )}
    >
      {children}
    </Link>
  )

  if (lite) {
    return <span className="inline-flex rounded-full">{link}</span>
  }

  return <span className="siri-glow inline-flex rounded-full">{link}</span>
}
