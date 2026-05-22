import { cva, type VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
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
 * Shared building blocks (DRY)
 * --------------------------------------------------------- */
const blurVariants = {
  none: "",
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
  xl: "backdrop-blur-xl",
} as const

const roundedVariants = {
  none: "rounded-none",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  full: "rounded-full",
} as const

const borderVariants = { none: "", subtle: "border", strong: "border-2" } as const

const shadowVariants = {
  none: "",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-xl",
} as const

/**
 * Tint compound variants — generated once and reused.
 * Tints are declared as a `tint` variant with empty strings, and the actual
 * background classes are applied via compound (tint, intensity) so they
 * override the (theme, intensity) bg-white/black compounds when active.
 *
 * NativeWind: every class is statically valid for the JIT.
 */
const tintEmptyVariants = {
  none: "",
  blue: "",
  pink: "",
  orange: "",
  teal: "",
} as const

type TintColor = "blue" | "pink" | "orange" | "teal"
const TINT_COLORS: TintColor[] = ["blue", "pink", "orange", "teal"]

const TINT_BG: Record<TintColor, Record<"subtle" | "medium" | "strong", string>> = {
  blue: { subtle: "bg-blue-500/15", medium: "bg-blue-500/25", strong: "bg-blue-500/40" },
  pink: { subtle: "bg-pink-500/15", medium: "bg-pink-500/25", strong: "bg-pink-500/40" },
  orange: { subtle: "bg-orange-500/20", medium: "bg-orange-500/30", strong: "bg-orange-500/45" },
  teal: { subtle: "bg-teal-500/15", medium: "bg-teal-500/25", strong: "bg-teal-500/40" },
}

const tintCompounds = TINT_COLORS.flatMap((tint) => [
  { tint, intensity: "subtle" as const, className: TINT_BG[tint].subtle },
  { tint, intensity: "medium" as const, className: TINT_BG[tint].medium },
  { tint, intensity: "strong" as const, className: TINT_BG[tint].strong },
])

/** Resolve final class string with twMerge so conflicting bg-* utilities are deduped. */
function merge(s: string | undefined): string {
  return twMerge((s ?? "").trim())
}

/* -----------------------------------------------------------
 * GlassCard
 * --------------------------------------------------------- */
export const glassCardVariants = cva("overflow-hidden", {
  variants: {
    theme: { light: "", dark: "" },
    blur: blurVariants,
    rounded: roundedVariants,
    intensity: { subtle: "", medium: "", strong: "" },
    border: borderVariants,
    padding: { sm: "p-4", md: "p-6", lg: "p-8" },
    shadow: shadowVariants,
    tint: tintEmptyVariants,
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
    ...tintCompounds,
  ],
  defaultVariants: {
    theme: "light",
    blur: "md",
    rounded: "2xl",
    intensity: "medium",
    border: "subtle",
    padding: "md",
    shadow: "md",
    tint: "none",
  },
})

export function getGlassCardClasses(o: GlassOptions): string {
  return merge(
    glassCardVariants({
      theme: o.theme,
      blur: o.blur,
      rounded: o.rounded,
      intensity: o.intensity,
      border: o.border,
      padding: o.padding,
      shadow: o.shadow,
      tint: o.tint,
    }),
  )
}

/* -----------------------------------------------------------
 * GlassButton
 * --------------------------------------------------------- */
export const glassButtonVariants = cva(
  "inline-flex items-center justify-center overflow-hidden font-semibold tracking-tight transition-all active:scale-[0.97]",
  {
    variants: {
      theme: { light: "", dark: "" },
      blur: blurVariants,
      rounded: roundedVariants,
      intensity: { subtle: "", medium: "", strong: "" },
      border: borderVariants,
      // For buttons, padding maps to size (height + horizontal padding)
      padding: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-5 text-sm",
        lg: "h-12 px-7 text-base",
      },
      shadow: shadowVariants,
      tint: tintEmptyVariants,
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
      ...tintCompounds,
    ],
    defaultVariants: {
      theme: "dark",
      blur: "md",
      rounded: "full",
      intensity: "medium",
      border: "subtle",
      padding: "md",
      shadow: "md",
      tint: "none",
    },
  },
)

export function getGlassButtonClasses(o: GlassOptions): string {
  return merge(
    glassButtonVariants({
      theme: o.theme,
      blur: o.blur,
      rounded: o.rounded,
      intensity: o.intensity,
      border: o.border,
      padding: o.padding,
      shadow: o.shadow,
      tint: o.tint,
    }),
  )
}

/* -----------------------------------------------------------
 * GlassInput
 * --------------------------------------------------------- */
export const glassInputVariants = cva(
  "w-full overflow-hidden font-medium tracking-tight transition-colors outline-none",
  {
    variants: {
      theme: { light: "", dark: "" },
      blur: blurVariants,
      rounded: roundedVariants,
      intensity: { subtle: "", medium: "", strong: "" },
      border: borderVariants,
      padding: {
        sm: "h-9 px-3 text-xs",
        md: "h-11 px-4 text-sm",
        lg: "h-14 px-5 text-base",
      },
      shadow: shadowVariants,
      tint: tintEmptyVariants,
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
      ...tintCompounds,
    ],
    defaultVariants: {
      theme: "dark",
      blur: "md",
      rounded: "xl",
      intensity: "medium",
      border: "subtle",
      padding: "md",
      shadow: "sm",
      tint: "none",
    },
  },
)

export function getGlassInputClasses(o: GlassOptions): string {
  return merge(
    glassInputVariants({
      theme: o.theme,
      blur: o.blur,
      rounded: o.rounded,
      intensity: o.intensity,
      border: o.border,
      padding: o.padding,
      shadow: o.shadow,
      tint: o.tint,
    }),
  )
}

/* -----------------------------------------------------------
 * GlassModal — overlay + centered card
 * --------------------------------------------------------- */
export const glassModalVariants = cva("overflow-hidden", {
  variants: {
    theme: { light: "", dark: "" },
    blur: blurVariants,
    rounded: roundedVariants,
    intensity: { subtle: "", medium: "", strong: "" },
    border: borderVariants,
    padding: { sm: "p-5", md: "p-6", lg: "p-8" },
    shadow: shadowVariants,
    tint: tintEmptyVariants,
  },
  compoundVariants: [
    { theme: "light", intensity: "subtle", className: "bg-white/30" },
    { theme: "light", intensity: "medium", className: "bg-white/50" },
    { theme: "light", intensity: "strong", className: "bg-white/70" },
    { theme: "dark", intensity: "subtle", className: "bg-black/40" },
    { theme: "dark", intensity: "medium", className: "bg-black/60" },
    { theme: "dark", intensity: "strong", className: "bg-black/75" },
    { theme: "light", border: "subtle", className: "border-white/40" },
    { theme: "light", border: "strong", className: "border-white/60" },
    { theme: "dark", border: "subtle", className: "border-white/10" },
    { theme: "dark", border: "strong", className: "border-white/20" },
    ...tintCompounds,
  ],
  defaultVariants: {
    theme: "dark",
    blur: "xl",
    rounded: "3xl",
    intensity: "medium",
    border: "subtle",
    padding: "lg",
    shadow: "lg",
    tint: "none",
  },
})

export function getGlassModalClasses(o: GlassOptions): string {
  return merge(
    glassModalVariants({
      theme: o.theme,
      blur: o.blur,
      rounded: o.rounded,
      intensity: o.intensity,
      border: o.border,
      padding: o.padding,
      shadow: o.shadow,
      tint: o.tint,
    }),
  )
}

/* -----------------------------------------------------------
 * GlassTabBar — horizontal navigation bar
 * --------------------------------------------------------- */
export const glassTabBarVariants = cva(
  "flex w-full items-center justify-around overflow-hidden",
  {
    variants: {
      theme: { light: "", dark: "" },
      blur: blurVariants,
      rounded: roundedVariants,
      intensity: { subtle: "", medium: "", strong: "" },
      border: borderVariants,
      // For tab bar, padding maps to height
      padding: {
        sm: "h-14 px-2",
        md: "h-16 px-3",
        lg: "h-20 px-4",
      },
      shadow: shadowVariants,
      tint: tintEmptyVariants,
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
      ...tintCompounds,
    ],
    defaultVariants: {
      theme: "dark",
      blur: "xl",
      rounded: "full",
      intensity: "medium",
      border: "subtle",
      padding: "md",
      shadow: "lg",
      tint: "none",
    },
  },
)

export function getGlassTabBarClasses(o: GlassOptions): string {
  return merge(
    glassTabBarVariants({
      theme: o.theme,
      blur: o.blur,
      rounded: o.rounded,
      intensity: o.intensity,
      border: o.border,
      padding: o.padding,
      shadow: o.shadow,
      tint: o.tint,
    }),
  )
}

/* -----------------------------------------------------------
 * GlassSwitch — toggle track wrapper
 * --------------------------------------------------------- */
export const glassSwitchVariants = cva("inline-flex items-center overflow-hidden", {
  variants: {
    theme: { light: "", dark: "" },
    blur: blurVariants,
    rounded: roundedVariants,
    intensity: { subtle: "", medium: "", strong: "" },
    border: borderVariants,
    padding: {
      sm: "h-7 w-12 p-0.5",
      md: "h-8 w-14 p-0.5",
      lg: "h-9 w-16 p-1",
    },
    shadow: shadowVariants,
    tint: tintEmptyVariants,
  },
  compoundVariants: [
    { theme: "light", intensity: "subtle", className: "bg-white/25" },
    { theme: "light", intensity: "medium", className: "bg-white/40" },
    { theme: "light", intensity: "strong", className: "bg-white/55" },
    { theme: "dark", intensity: "subtle", className: "bg-white/10" },
    { theme: "dark", intensity: "medium", className: "bg-white/18" },
    { theme: "dark", intensity: "strong", className: "bg-white/28" },
    { theme: "light", border: "subtle", className: "border-white/40" },
    { theme: "light", border: "strong", className: "border-white/60" },
    { theme: "dark", border: "subtle", className: "border-white/15" },
    { theme: "dark", border: "strong", className: "border-white/25" },
    ...tintCompounds,
  ],
  defaultVariants: {
    theme: "dark",
    blur: "md",
    rounded: "full",
    intensity: "medium",
    border: "subtle",
    padding: "md",
    shadow: "sm",
    tint: "none",
  },
})

export function getGlassSwitchClasses(o: GlassOptions): string {
  return merge(
    glassSwitchVariants({
      theme: o.theme,
      blur: o.blur,
      rounded: o.rounded,
      intensity: o.intensity,
      border: o.border,
      padding: o.padding,
      shadow: o.shadow,
      tint: o.tint,
    }),
  )
}

/* -----------------------------------------------------------
 * GlassNavigationBar — top bar
 * --------------------------------------------------------- */
export const glassNavbarVariants = cva(
  "flex w-full items-center justify-between overflow-hidden",
  {
    variants: {
      theme: { light: "", dark: "" },
      blur: blurVariants,
      rounded: roundedVariants,
      intensity: { subtle: "", medium: "", strong: "" },
      border: borderVariants,
      padding: {
        sm: "h-12 px-3",
        md: "h-14 px-4",
        lg: "h-16 px-5",
      },
      shadow: shadowVariants,
      tint: tintEmptyVariants,
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
      ...tintCompounds,
    ],
    defaultVariants: {
      theme: "dark",
      blur: "xl",
      rounded: "none",
      intensity: "medium",
      border: "subtle",
      padding: "md",
      shadow: "sm",
      tint: "none",
    },
  },
)

export function getGlassNavbarClasses(o: GlassOptions): string {
  return merge(
    glassNavbarVariants({
      theme: o.theme,
      blur: o.blur,
      rounded: o.rounded,
      intensity: o.intensity,
      border: o.border,
      padding: o.padding,
      shadow: o.shadow,
      tint: o.tint,
    }),
  )
}

export type GlassCardVariantProps = VariantProps<typeof glassCardVariants>
export type GlassButtonVariantProps = VariantProps<typeof glassButtonVariants>
export type GlassInputVariantProps = VariantProps<typeof glassInputVariants>
export type GlassModalVariantProps = VariantProps<typeof glassModalVariants>
export type GlassTabBarVariantProps = VariantProps<typeof glassTabBarVariants>
export type GlassSwitchVariantProps = VariantProps<typeof glassSwitchVariants>
export type GlassNavbarVariantProps = VariantProps<typeof glassNavbarVariants>
