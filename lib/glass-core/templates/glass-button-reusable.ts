import type { GlassOptions } from "../types"

/**
 * Reusable export — full <GlassButton /> using CVA + tailwind-merge.
 * Future home: `@glass-ui/native`.
 */
export function renderGlassButtonReusable(options: GlassOptions): string {
  return `// glass-button.tsx
// Drop this file into your project (e.g. components/ui/glass-button.tsx).
// Requires: react-native, nativewind, class-variance-authority, tailwind-merge, clsx.
import * as React from "react"
import { Pressable, Text, type PressableProps } from "react-native"
import { cva, type VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const glassButtonVariants = cva(
  "inline-flex items-center justify-center overflow-hidden font-semibold tracking-tight transition-all active:scale-[0.97]",
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
        md: "h-10 px-5 text-sm",
        lg: "h-12 px-7 text-base",
      },
      shadow: { none: "", sm: "shadow-sm", md: "shadow-md", lg: "shadow-xl" },
    },
    compoundVariants: [
      { theme: "light", intensity: "subtle", className: "bg-white/15 text-neutral-900" },
      { theme: "light", intensity: "medium", className: "bg-white/30 text-neutral-900" },
      { theme: "light", intensity: "strong", className: "bg-white/50 text-neutral-900" },
      { theme: "dark", intensity: "subtle", className: "bg-white/10 text-white" },
      { theme: "dark", intensity: "medium", className: "bg-white/15 text-white" },
      { theme: "dark", intensity: "strong", className: "bg-white/25 text-white" },
      { theme: "light", border: "subtle", className: "border-white/40" },
      { theme: "light", border: "strong", className: "border-white/60" },
      { theme: "dark", border: "subtle", className: "border-white/15" },
      { theme: "dark", border: "strong", className: "border-white/25" },
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

export type GlassButtonProps = Omit<PressableProps, "children"> &
  VariantProps<typeof glassButtonVariants> & {
    className?: string
    children?: React.ReactNode
  }

/**
 * <GlassButton /> — frosted-glass button for React Native + NativeWind.
 *
 * @example
 * <GlassButton theme="dark" rounded="full">
 *   Continue
 * </GlassButton>
 */
export const GlassButton = React.forwardRef<React.ElementRef<typeof Pressable>, GlassButtonProps>(
  ({ theme, blur, rounded, intensity, border, size, shadow, className, children, ...props }, ref) => {
    return (
      <Pressable
        ref={ref}
        className={cn(glassButtonVariants({ theme, blur, rounded, intensity, border, size, shadow }), className)}
        {...props}
      >
        {typeof children === "string" ? <Text className="font-semibold">{children}</Text> : children}
      </Pressable>
    )
  },
)
GlassButton.displayName = "GlassButton"
`
}
