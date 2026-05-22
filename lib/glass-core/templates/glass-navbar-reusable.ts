import type { GlassOptions } from "../types"
import { TINT_COMPOUNDS_SNIPPET, TINT_VARIANT_SNIPPET } from "./_shared"

export function renderGlassNavbarReusable(options: GlassOptions): string {
  return `import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const glassNavbarVariants = cva(
  "flex w-full items-center justify-between overflow-hidden",
  {
    variants: {
      theme: { light: "", dark: "" },
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
      intensity: { subtle: "", medium: "", strong: "" },
      border: { none: "", subtle: "border", strong: "border-2" },
      padding: {
        sm: "h-12 px-3",
        md: "h-14 px-4",
        lg: "h-16 px-5",
      },
      shadow: { none: "", sm: "shadow-sm", md: "shadow-md", lg: "shadow-xl" },
      ${TINT_VARIANT_SNIPPET},
    },
    compoundVariants: [
      { theme: "light", intensity: "subtle", className: "bg-white/20" },
      { theme: "light", intensity: "medium", className: "bg-white/35" },
      { theme: "light", intensity: "strong", className: "bg-white/50" },
      { theme: "dark", intensity: "subtle", className: "bg-black/25" },
      { theme: "dark", intensity: "medium", className: "bg-black/45" },
      { theme: "dark", intensity: "strong", className: "bg-black/65" },
      { theme: "light", border: "subtle", className: "border-white/30" },
      { theme: "light", border: "strong", className: "border-white/50" },
      { theme: "dark", border: "subtle", className: "border-white/10" },
      { theme: "dark", border: "strong", className: "border-white/20" },
${TINT_COMPOUNDS_SNIPPET}
    ],
    defaultVariants: {
      theme: "${options.theme}",
      blur: "${options.blur}",
      rounded: "${options.rounded}",
      intensity: "${options.intensity}",
      border: "${options.border}",
      padding: "${options.padding}",
      shadow: "${options.shadow}",
      tint: "${options.tint}",
    },
  },
)

export interface GlassNavigationBarProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof glassNavbarVariants> {
  title?: string
  leading?: React.ReactNode
  trailing?: React.ReactNode
}

export const GlassNavigationBar = React.forwardRef<HTMLElement, GlassNavigationBarProps>(
  ({ className, theme, blur, rounded, intensity, border, padding, shadow, tint, title, leading, trailing, children, ...props }, ref) => {
    const fg = theme === "dark" ? "text-white" : "text-neutral-900"
    return (
      <header
        ref={ref as React.Ref<HTMLElement>}
        className={cn(glassNavbarVariants({ theme, blur, rounded, intensity, border, padding, shadow, tint }), className)}
        {...props}
      >
        <div className="flex min-w-0 flex-1 items-center justify-start">{leading}</div>
        {title ? <h1 className={cn("truncate px-2 text-center text-base font-semibold", fg)}>{title}</h1> : null}
        <div className="flex min-w-0 flex-1 items-center justify-end">{trailing ?? children}</div>
      </header>
    )
  },
)
GlassNavigationBar.displayName = "GlassNavigationBar"
`
}
