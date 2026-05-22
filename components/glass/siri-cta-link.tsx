"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

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
  return (
    <span className="siri-glow inline-flex rounded-full">
      <Link
        href={href}
        className={cn(
          "relative z-10 inline-flex items-center gap-2.5 rounded-full bg-foreground px-8 py-4 text-base font-semibold text-background",
          "shadow-[0_10px_30px_-12px_oklch(0.7_0.18_250_/_0.45)] transition-transform active:scale-[0.97]",
          "group",
          className,
        )}
      >
        {children}
      </Link>
    </span>
  )
}
