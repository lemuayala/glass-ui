import type { GlassOptions } from "../types"
import { TINT_COMPOUNDS_SNIPPET, TINT_VARIANT_SNIPPET } from "./_shared"

/**
 * Reusable export — full <GlassTabBar /> using CVA + tailwind-merge.
 * Future home: `@glass-ui/native`.
 */
export function renderGlassTabBarReusable(options: GlassOptions): string {
  return `// glass-tabbar.tsx
// Drop this file into your project (e.g. components/ui/glass-tabbar.tsx).
// Requires: react-native, nativewind, class-variance-authority, tailwind-merge, clsx.
import * as React from "react"
import { View, type ViewProps } from "react-native"
import { cva, type VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const glassTabBarVariants = cva(
  "flex w-full items-center justify-around overflow-hidden",
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
      // Padding maps to height for tab bars
      size: {
        sm: "h-14 px-2",
        md: "h-16 px-3",
        lg: "h-20 px-4",
      },
      shadow: { none: "", sm: "shadow-sm", md: "shadow-md", lg: "shadow-xl" },
      ${TINT_VARIANT_SNIPPET},
    },
    compoundVariants: [
      { theme: "light", intensity: "subtle", className: "bg-white/20" },
      { theme: "light", intensity: "medium", className: "bg-white/40" },
      { theme: "light", intensity: "strong", className: "bg-white/60" },
      { theme: "dark", intensity: "subtle", className: "bg-black/30" },
      { theme: "dark", intensity: "medium", className: "bg-black/50" },
      { theme: "dark", intensity: "strong", className: "bg-black/70" },
      { theme: "light", border: "subtle", className: "border-white/40" },
      { theme: "light", border: "strong", className: "border-white/60" },
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

export type GlassTabBarProps = ViewProps &
  VariantProps<typeof glassTabBarVariants> & {
    className?: string
    children?: React.ReactNode
  }

/**
 * <GlassTabBar /> — frosted-glass tab bar container for React Native + NativeWind.
 *
 * @example
 * <GlassTabBar theme="dark" tint="blue">
 *   {tabs.map(t => <TabButton key={t.id} {...t} />)}
 * </GlassTabBar>
 */
export const GlassTabBar = React.forwardRef<View, GlassTabBarProps>(
  ({ theme, blur, rounded, intensity, border, size, shadow, tint, className, children, ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={cn(glassTabBarVariants({ theme, blur, rounded, intensity, border, size, shadow, tint }), className)}
        {...props}
      >
        {children}
      </View>
    )
  },
)
GlassTabBar.displayName = "GlassTabBar"
`
}
