import { cva, type VariantProps } from "class-variance-authority"
import type { GlassOptions } from "./types"

/**
 * Glass variants — single source of truth.
 *
 * The same definitions power:
 *  • the CVA component used by the live preview (web)
 *  • the React Native + NativeWind code that gets exported
 *
 * All Tailwind utilities used here are NativeWind-compatible.
 */

/* -----------------------------------------------------------
 * GlassCard
 * --------------------------------------------------------- */
export const glassCardVariants = cva("overflow-hidden", {
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
    padding: { sm: "p-4", md: "p-6", lg: "p-8" },
    shadow: { none: "", sm: "shadow-sm", md: "shadow-md", lg: "shadow-xl" },
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
    theme: "light",
    blur: "md",
    rounded: "2xl",
    intensity: "medium",
    border: "subtle",
    padding: "md",
    shadow: "md",
  },
})

export function getGlassCardClasses(o: GlassOptions): string {
  return glassCardVariants({
    theme: o.theme,
    blur: o.blur,
    rounded: o.rounded,
    intensity: o.intensity,
    border: o.border,
    padding: o.padding,
    shadow: o.shadow,
  })
}

/* -----------------------------------------------------------
 * GlassButton
 * --------------------------------------------------------- */
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
      // For buttons, padding maps to size (height + horizontal padding)
      padding: {
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
      theme: "dark",
      blur: "md",
      rounded: "full",
      intensity: "medium",
      border: "subtle",
      padding: "md",
      shadow: "md",
    },
  },
)

export function getGlassButtonClasses(o: GlassOptions): string {
  return glassButtonVariants({
    theme: o.theme,
    blur: o.blur,
    rounded: o.rounded,
    intensity: o.intensity,
    border: o.border,
    padding: o.padding,
    shadow: o.shadow,
  })
}

/* -----------------------------------------------------------
 * GlassInput
 * --------------------------------------------------------- */
export const glassInputVariants = cva(
  "w-full overflow-hidden font-medium tracking-tight transition-colors outline-none",
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
      theme: "dark",
      blur: "md",
      rounded: "xl",
      intensity: "medium",
      border: "subtle",
      padding: "md",
      shadow: "sm",
    },
  },
)

export function getGlassInputClasses(o: GlassOptions): string {
  return glassInputVariants({
    theme: o.theme,
    blur: o.blur,
    rounded: o.rounded,
    intensity: o.intensity,
    border: o.border,
    padding: o.padding,
    shadow: o.shadow,
  })
}

export type GlassCardVariantProps = VariantProps<typeof glassCardVariants>
export type GlassButtonVariantProps = VariantProps<typeof glassButtonVariants>
export type GlassInputVariantProps = VariantProps<typeof glassInputVariants>
