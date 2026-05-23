"use client"

import Image from "next/image"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

type BrandLogoProps = {
  size?: number
  className?: string
  priority?: boolean
}

/** Squircle app icon — dark / light PNG pair for theme-aware UI. */
export function BrandLogo({ size = 36, className, priority = false }: BrandLogoProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isLight = mounted && resolvedTheme === "light"
  const src = isLight ? "/apple-icon-light.png" : "/apple-icon.png"

  return (
    <Image
      src={src}
      alt="Glass UI"
      width={size}
      height={size}
      priority={priority}
      className={cn("h-[var(--gg-logo)] w-[var(--gg-logo)] shrink-0 object-contain", className)}
      style={{ ["--gg-logo" as string]: `${size}px` }}
    />
  )
}
