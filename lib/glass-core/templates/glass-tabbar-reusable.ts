import type { GlassOptions } from "../types"
import { TINT_COMPOUNDS_SNIPPET, TINT_VARIANT_SNIPPET } from "./_shared"

export function renderGlassTabBarReusable(options: GlassOptions): string {
  const { theme, blur, rounded, intensity, border, padding, shadow, tint } = options
  return `import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const glassTabBarVariants = cva(
  "flex items-center justify-around overflow-hidden",
  {
    variants: {
      theme: {
        light: "text-neutral-900",
        dark: "text-white",
      },
      blur: {
        none: "",
        sm: "backdrop-blur-sm",
        md: "backdrop-blur-md",
        lg: "backdrop-blur-lg",
        xl: "backdrop-blur-xl",
      },
      rounded: {
        none: "rounded-none",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        "2xl": "rounded-2xl",
        "3xl": "rounded-3xl",
        full: "rounded-full",
      },
      intensity: {
        subtle: "",
        medium: "",
        strong: "",
      },
      border: {
        none: "",
        subtle: "border",
        strong: "border-2",
      },
      padding: {
        sm: "h-12 px-4",
        md: "h-14 px-6",
        lg: "h-16 px-8",
      },
      shadow: {
        none: "",
        sm: "shadow-sm",
        md: "shadow-md",
        lg: "shadow-xl",
      },
      ${TINT_VARIANT_SNIPPET},
    },
    compoundVariants: [
      { theme: "light", intensity: "subtle", className: "bg-white/20" },
      { theme: "light", intensity: "medium", className: "bg-white/40" },
      { theme: "light", intensity: "strong", className: "bg-white/70" },
      { theme: "dark", intensity: "subtle", className: "bg-black/20" },
      { theme: "dark", intensity: "medium", className: "bg-black/40" },
      { theme: "dark", intensity: "strong", className: "bg-black/60" },
      { theme: "light", border: "subtle", className: "border-white/30" },
      { theme: "light", border: "strong", className: "border-white/50" },
      { theme: "dark", border: "subtle", className: "border-white/10" },
      { theme: "dark", border: "strong", className: "border-white/20" },
${TINT_COMPOUNDS_SNIPPET}
    ],
    defaultVariants: {
      theme: "${theme}",
      blur: "${blur}",
      rounded: "${rounded}",
      intensity: "${intensity}",
      border: "${border}",
      padding: "${padding}",
      shadow: "${shadow}",
      tint: "${tint}",
    },
  },
)

export interface GlassTabBarProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof glassTabBarVariants> {}

export const GlassTabBar = React.forwardRef<HTMLElement, GlassTabBarProps>(
  ({ className, theme, blur, rounded, intensity, border, padding, shadow, tint, ...props }, ref) => {
    return (
      <nav
        ref={ref as React.Ref<HTMLElement>}
        className={cn(glassTabBarVariants({ theme, blur, rounded, intensity, border, padding, shadow, tint }), className)}
        {...props}
      />
    )
  },
)
GlassTabBar.displayName = "GlassTabBar"
`
}
