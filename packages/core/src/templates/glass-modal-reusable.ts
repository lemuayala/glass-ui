import type { GlassOptions } from "../types.js"
import { TINT_COMPOUNDS_SNIPPET, TINT_VARIANT_SNIPPET } from "./_shared.js"

export function renderGlassModalReusable(options: GlassOptions): string {
  const { theme, blur, rounded, intensity, border, padding, shadow, tint } = options
  return `import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const glassModalVariants = cva("overflow-hidden shadow-2xl", {
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
      sm: "p-6",
      md: "p-8",
      lg: "p-10",
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
    { theme: "dark", intensity: "subtle", className: "bg-black/30" },
    { theme: "dark", intensity: "medium", className: "bg-black/60" },
    { theme: "dark", intensity: "strong", className: "bg-black/80" },
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
})

export interface GlassModalProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassModalVariants> {}

export const GlassModal = React.forwardRef<HTMLDivElement, GlassModalProps>(
  ({ className, theme, blur, rounded, intensity, border, padding, shadow, tint, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(glassModalVariants({ theme, blur, rounded, intensity, border, padding, shadow, tint }), className)}
        {...props}
      />
    )
  },
)
GlassModal.displayName = "GlassModal"
`
}
