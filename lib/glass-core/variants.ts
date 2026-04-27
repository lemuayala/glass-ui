import { cva, type VariantProps } from "class-variance-authority"
import type { GlassOptions } from "./types"

/**
 * GlassCard variants — single source of truth.
 *
 * The same definition powers:
 *  • the CVA component used by the live preview (web)
 *  • the React Native + NativeWind code that gets exported
 *
 * All Tailwind utilities used here are NativeWind-compatible.
 */
export const glassCardVariants = cva(
  // base classes — applied to every variant
  "overflow-hidden",
  {
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
      // light + intensity
      { theme: "light", intensity: "subtle", className: "bg-white/10" },
      { theme: "light", intensity: "medium", className: "bg-white/20" },
      { theme: "light", intensity: "strong", className: "bg-white/40" },
      // dark + intensity
      { theme: "dark", intensity: "subtle", className: "bg-black/20" },
      { theme: "dark", intensity: "medium", className: "bg-black/40" },
      { theme: "dark", intensity: "strong", className: "bg-black/60" },
      // light + border
      { theme: "light", border: "subtle", className: "border-white/30" },
      { theme: "light", border: "strong", className: "border-white/50" },
      // dark + border
      { theme: "dark", border: "subtle", className: "border-white/10" },
      { theme: "dark", border: "strong", className: "border-white/20" },
    ],
    defaultVariants: {
      theme: "light",
      blur: "md",
      rounded: "2xl",
      intensity: "medium",
      border: "subtle",
      padding: "md",
      shadow: "md",
    },
  },
)

export type GlassCardVariantProps = VariantProps<typeof glassCardVariants>

export function getGlassCardClasses(options: GlassOptions): string {
  return glassCardVariants({
    theme: options.theme,
    blur: options.blur,
    rounded: options.rounded,
    intensity: options.intensity,
    border: options.border,
    padding: options.padding,
    shadow: options.shadow,
  })
}
