import type { GlassOptions } from "../types"

/**
 * Reusable export — full GlassCard component using CVA + tailwind-merge,
 * with typed variants and sensible defaults coming from the current
 * playground selection.
 *
 * Future home: `@glass-ui/native`.
 */
export function renderGlassCardReusable(options: GlassOptions): string {
  return `// glass-card.tsx
// Drop this file into your project (e.g. components/ui/glass-card.tsx).
// Requires: react-native, nativewind, class-variance-authority, tailwind-merge, clsx.
import * as React from "react"
import { View, Text, type ViewProps } from "react-native"
import { cva, type VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Variants for <GlassCard />.
 *
 * Generated from the Glass UI playground.
 * Tweak any value — every utility here is NativeWind-compatible.
 */
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
  ],
  defaultVariants: {
    theme: "${options.theme}",
    blur: "${options.blur}",
    rounded: "${options.rounded}",
    intensity: "${options.intensity}",
    border: "${options.border}",
    padding: "${options.padding}",
    shadow: "${options.shadow}",
  },
})

export type GlassCardProps = ViewProps &
  VariantProps<typeof glassCardVariants> & {
    /** Optional className appended at the end (overrides variants). */
    className?: string
    children?: React.ReactNode
  }

/**
 * <GlassCard /> — frosted-glass surface for React Native + NativeWind.
 *
 * @example
 * <GlassCard theme="dark" blur="lg" rounded="2xl">
 *   <Text className="text-white">Hello</Text>
 * </GlassCard>
 */
export const GlassCard = React.forwardRef<View, GlassCardProps>(
  ({ theme, blur, rounded, intensity, border, padding, shadow, className, children, ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={cn(
          glassCardVariants({ theme, blur, rounded, intensity, border, padding, shadow }),
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

/* ---------- Usage ----------
import { GlassCard } from "./components/ui/glass-card"
import { Text } from "react-native"

<GlassCard theme="${options.theme}" blur="${options.blur}" rounded="${options.rounded}">
  <Text className="text-base font-semibold ${
    options.theme === "dark" ? "text-white" : "text-neutral-900"
  }">
    Glass Card
  </Text>
</GlassCard>
---------------------------- */
`
}
