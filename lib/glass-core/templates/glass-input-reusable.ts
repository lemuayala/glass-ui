import type { GlassOptions } from "../types"
import { TINT_COMPOUNDS_SNIPPET, TINT_VARIANT_SNIPPET } from "./_shared"

/**
 * Reusable export — full GlassInput component using CVA + tailwind-merge.
 */
export function renderGlassInputReusable(options: GlassOptions): string {
  return `import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const glassInputVariants = cva(
  "w-full bg-transparent outline-none transition-all placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/30",
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
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-5 text-base",
      },
      shadow: { none: "", sm: "shadow-sm", md: "shadow-md", lg: "shadow-xl" },
      ${TINT_VARIANT_SNIPPET},
    },
    compoundVariants: [
      { theme: "light", intensity: "subtle", className: "bg-white/10 text-neutral-900" },
      { theme: "light", intensity: "medium", className: "bg-white/20 text-neutral-900" },
      { theme: "light", intensity: "strong", className: "bg-white/40 text-neutral-900" },
      { theme: "dark", intensity: "subtle", className: "bg-black/20 text-white" },
      { theme: "dark", intensity: "medium", className: "bg-black/40 text-white" },
      { theme: "dark", intensity: "strong", className: "bg-black/60 text-white" },
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
      size: "${options.padding}",
      shadow: "${options.shadow}",
      tint: "${options.tint}",
    },
  },
)

export interface GlassInputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof glassInputVariants> {}

export const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, theme, blur, rounded, intensity, border, size, shadow, tint, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(glassInputVariants({ theme, blur, rounded, intensity, border, size, shadow, tint }), className)}
        {...props}
      />
    )
  },
)
GlassInput.displayName = "GlassInput"
`
}
