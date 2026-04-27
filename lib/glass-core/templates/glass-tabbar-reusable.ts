import type { GlassOptions } from "../types"

export function renderGlassTabBarReusable(options: GlassOptions): string {
  const { theme, blur, rounded, intensity, border, padding, shadow, tint } = options
  return `import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const glassTabBarVariants = cva(
  "flex items-center justify-around overflow-hidden",
  {
    variants: {
      theme: {
        light: "bg-white/40 text-neutral-900",
        dark: "bg-black/40 text-white",
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
        subtle: "border border-white/20",
        strong: "border-2 border-white/30",
      },
      padding: {
        sm: "h-12 px-4",
        md: "h-14 px-6",
        lg: "h-16 px-8",
      },
      shadow: {
        none: "",
        sm: "shadow-sm",
        md: "shadow-md",
        lg: "shadow-xl",
      },
      tint: {
        none: "",
        blue: "bg-blue-500/10",
        pink: "bg-pink-500/10",
        orange: "bg-orange-500/10",
        teal: "bg-teal-500/10",
      },
    },
    compoundVariants: [
      { theme: "light", intensity: "subtle", className: "bg-white/20" },
      { theme: "light", intensity: "medium", className: "bg-white/40" },
      { theme: "light", intensity: "strong", className: "bg-white/70" },
      { theme: "dark", intensity: "subtle", className: "bg-black/20" },
      { theme: "dark", intensity: "medium", className: "bg-black/40" },
      { theme: "dark", intensity: "strong", className: "bg-black/60" },
      { theme: "light", border: "subtle", className: "border-white/30" },
      { theme: "light", border: "strong", className: "border-white/50" },
      { theme: "dark", border: "subtle", className: "border-white/10" },
      { theme: "dark", border: "strong", className: "border-white/20" },
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
  },
)

export interface GlassTabBarProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof glassTabBarVariants> {}

export const GlassTabBar = React.forwardRef<HTMLElement, GlassTabBarProps>(
  ({ className, theme, blur, rounded, intensity, border, padding, shadow, tint, ...props }, ref) => {
    return (
      <nav
        ref={ref as React.Ref<HTMLElement>}
        className={cn(glassTabBarVariants({ theme, blur, rounded, intensity, border, padding, shadow, tint }), className)}
        {...props}
      />
    )
  },
)
GlassTabBar.displayName = "GlassTabBar"
`
}

export function renderGlassTabBarInline(options: GlassOptions): string {
  const { theme } = options
  const iconColor = theme === "dark" ? "bg-white/30" : "bg-black/20"
  const iconActive = theme === "dark" ? "bg-white/80" : "bg-black/70"
  return `// 👇 Paste this anywhere in your React component.
export function Example() {
  return (
    <nav className="flex h-14 w-full max-w-sm items-center justify-around overflow-hidden rounded-full border border-white/20 bg-black/40 px-6 shadow-lg backdrop-blur-xl">
      <button className="flex flex-col items-center gap-0.5">
        <div className="h-5 w-5 rounded-full ${iconActive}" />
        <span className="text-[9px] text-white">Home</span>
      </button>
      <button className="flex flex-col items-center gap-0.5">
        <div className="h-5 w-5 rounded-full ${iconColor}" />
        <span className="text-[9px] text-white/55">Search</span>
      </button>
      <button className="flex flex-col items-center gap-0.5">
        <div className="h-5 w-5 rounded-full ${iconColor}" />
        <span className="text-[9px] text-white/55">Profile</span>
      </button>
    </nav>
  )
}
`
}
