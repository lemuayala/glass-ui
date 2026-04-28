import type { GlassOptions } from "../types"

export function renderGlassModalReusable(options: GlassOptions): string {
  const { theme, blur, rounded, intensity, border, padding, shadow, tint } = options
  return `import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const glassModalVariants = cva("overflow-hidden shadow-2xl", {
  variants: {
    theme: {
      light: "bg-white/40 text-neutral-900",
      dark: "bg-black/60 text-white",
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
      sm: "p-6",
      md: "p-8",
      lg: "p-10",
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
    { theme: "dark", intensity: "subtle", className: "bg-black/30" },
    { theme: "dark", intensity: "medium", className: "bg-black/60" },
    { theme: "dark", intensity: "strong", className: "bg-black/80" },
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
})

export interface GlassModalProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassModalVariants> {}

export const GlassModal = React.forwardRef<HTMLDivElement, GlassModalProps>(
  ({ className, theme, blur, rounded, intensity, border, padding, shadow, tint, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(glassModalVariants({ theme, blur, rounded, intensity, border, padding, shadow, tint }), className)}
        {...props}
      />
    )
  },
)
GlassModal.displayName = "GlassModal"
`
}

export function renderGlassModalInline(options: GlassOptions): string {
  const { theme } = options
  const textColor = theme === "dark" ? "text-white" : "text-neutral-900"
  const textMuted = theme === "dark" ? "text-white/70" : "text-neutral-700"
  const title = options.text || "Confirm action"
  return `// 👇 Paste this anywhere in your React component.
export function Example() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-black/60 p-8 shadow-2xl backdrop-blur-xl">
        <h2 className="text-xl font-bold ${textColor}">${title}</h2>
        <p className="mt-2 ${textMuted}">This action can be undone from settings.</p>
        <div className="mt-6 flex justify-end gap-2">
          <button className="h-9 rounded-full px-4 text-xs font-medium ${textMuted} hover:bg-white/10">Cancel</button>
          <button className="h-9 rounded-full bg-white/20 px-4 text-xs font-semibold ${textColor}">Confirm</button>
        </div>
      </div>
    </div>
  )
}
`
}
