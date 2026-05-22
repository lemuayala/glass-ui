import Image from "next/image"
import { cn } from "@/lib/utils"

type BrandLogoProps = {
  size?: number
  className?: string
  priority?: boolean
}

/** Glass UI mark — transparent PNG, no v0 placeholder. */
export function BrandLogo({ size = 36, className, priority = false }: BrandLogoProps) {
  return (
    <Image
      src="/glass-logo.png"
      alt="Glass UI"
      width={size}
      height={size}
      priority={priority}
      className={cn("h-[var(--gg-logo)] w-[var(--gg-logo)] shrink-0 object-contain", className)}
      style={{ ["--gg-logo" as string]: `${size}px` }}
    />
  )
}
