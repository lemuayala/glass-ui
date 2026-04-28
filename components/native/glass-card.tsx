// glass-card.tsx
// Drop this file into your React Native project.
// Requires: react-native, nativewind, class-variance-authority, tailwind-merge, clsx.
import * as React from "react"
import { View, type ViewProps } from "react-native"
import { cva, type VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const glassCardVariants = cva("overflow-hidden", {
  variants: {
    theme: {
      light: "",
      dark: "",
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
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    },
    shadow: {
      none: "",
      sm: "shadow-sm",
      md: "shadow-md",
      lg: "shadow-xl",
    },
    tint: {
      none: "",
      blue: "",
      pink: "",
      orange: "",
      teal: "",
    },
  },
  compoundVariants: [
    { theme: "light", intensity: "subtle", className: "bg-white/10" },
    { theme: "light", intensity: "medium", className: "bg-white/20" },
    { theme: "light", intensity: "strong", className: "bg-white/40" },
    { theme: "dark", intensity: "subtle", className: "bg-black/20" },
    { theme: "dark", intensity: "medium", className: "bg-black/40" },
    { theme: "dark", intensity: "strong", className: "bg-black/60" },
    { theme: "light", border: "subtle", className: "border-white/30" },
    { theme: "light", border: "strong", className: "border-white/50" },
    { theme: "dark", border: "subtle", className: "border-white/10" },
    { theme: "dark", border: "strong", className: "border-white/20" },
    { tint: "blue", intensity: "subtle", className: "bg-blue-500/15" },
    { tint: "blue", intensity: "medium", className: "bg-blue-500/25" },
    { tint: "blue", intensity: "strong", className: "bg-blue-500/40" },
    { tint: "pink", intensity: "subtle", className: "bg-pink-500/15" },
    { tint: "pink", intensity: "medium", className: "bg-pink-500/25" },
    { tint: "pink", intensity: "strong", className: "bg-pink-500/40" },
    { tint: "orange", intensity: "subtle", className: "bg-orange-500/20" },
    { tint: "orange", intensity: "medium", className: "bg-orange-500/30" },
    { tint: "orange", intensity: "strong", className: "bg-orange-500/45" },
    { tint: "teal", intensity: "subtle", className: "bg-teal-500/15" },
    { tint: "teal", intensity: "medium", className: "bg-teal-500/25" },
    { tint: "teal", intensity: "strong", className: "bg-teal-500/40" },
  ],
  defaultVariants: {
    theme: "dark",
    blur: "lg",
    rounded: "3xl",
    intensity: "medium",
    border: "subtle",
    padding: "md",
    shadow: "lg",
    tint: "teal",
  },
})

export type GlassCardProps = ViewProps &
  VariantProps<typeof glassCardVariants> & {
    className?: string
    children?: React.ReactNode
  }

export const GlassCard = React.forwardRef<View, GlassCardProps>(
  ({ theme, blur, rounded, intensity, border, padding, shadow, tint, className, children, ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={cn(
          glassCardVariants({ theme, blur, rounded, intensity, border, padding, shadow, tint }),
          className,
        )}
        {...props}
      >
        {children}
      </View>
    )
  },
)
GlassCard.displayName = "GlassCard"
