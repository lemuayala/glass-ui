import type { GlassOptions } from "../types"

/**
 * Reusable export — full <GlassInput /> using CVA + tailwind-merge.
 * Future home: `@glass-ui/native`.
 */
export function renderGlassInputReusable(options: GlassOptions): string {
  return `// glass-input.tsx
// Drop this file into your project (e.g. components/ui/glass-input.tsx).
// Requires: react-native, nativewind, class-variance-authority, tailwind-merge, clsx.
import * as React from "react"
import { TextInput, type TextInputProps } from "react-native"
import { cva, type VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const glassInputVariants = cva(
  "w-full overflow-hidden font-medium tracking-tight",
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
        sm: "h-9 px-3 text-xs",
        md: "h-11 px-4 text-sm",
        lg: "h-14 px-5 text-base",
      },
      shadow: { none: "", sm: "shadow-sm", md: "shadow-md", lg: "shadow-xl" },
    },
    compoundVariants: [
      { theme: "light", intensity: "subtle", className: "bg-white/15 text-neutral-900 placeholder:text-neutral-700/60" },
      { theme: "light", intensity: "medium", className: "bg-white/30 text-neutral-900 placeholder:text-neutral-700/70" },
      { theme: "light", intensity: "strong", className: "bg-white/50 text-neutral-900 placeholder:text-neutral-700/80" },
      { theme: "dark", intensity: "subtle", className: "bg-black/20 text-white placeholder:text-white/50" },
      { theme: "dark", intensity: "medium", className: "bg-black/35 text-white placeholder:text-white/55" },
      { theme: "dark", intensity: "strong", className: "bg-black/55 text-white placeholder:text-white/60" },
      { theme: "light", border: "subtle", className: "border-white/40" },
      { theme: "light", border: "strong", className: "border-white/60" },
      { theme: "dark", border: "subtle", className: "border-white/10" },
      { theme: "dark", border: "strong", className: "border-white/20" },
    ],
    defaultVariants: {
      theme: "${options.theme}",
      blur: "${options.blur}",
      rounded: "${options.rounded}",
      intensity: "${options.intensity}",
      border: "${options.border}",
      size: "${options.padding}",
      shadow: "${options.shadow}",
    },
  },
)

export type GlassInputProps = TextInputProps &
  VariantProps<typeof glassInputVariants> & {
    className?: string
  }

/**
 * <GlassInput /> — frosted-glass text input for React Native + NativeWind.
 *
 * @example
 * <GlassInput theme="dark" placeholder="Search…" />
 */
export const GlassInput = React.forwardRef<React.ElementRef<typeof TextInput>, GlassInputProps>(
  ({ theme, blur, rounded, intensity, border, size, shadow, className, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        placeholderTextColor={theme === "dark" ? "rgba(255,255,255,0.55)" : "rgba(23,23,23,0.6)"}
        className={cn(glassInputVariants({ theme, blur, rounded, intensity, border, size, shadow }), className)}
        {...props}
      />
    )
  },
)
GlassInput.displayName = "GlassInput"
`
}
