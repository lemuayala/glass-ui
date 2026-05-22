import type { GlassOptions } from "../types"
import { TINT_COMPOUNDS_SNIPPET, TINT_VARIANT_SNIPPET } from "./_shared"

export function renderGlassSwitchReusable(options: GlassOptions): string {
  return `import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const glassSwitchVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer items-center overflow-hidden transition-colors",
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
        sm: "h-7 w-12",
        md: "h-8 w-14",
        lg: "h-9 w-16",
      },
      shadow: { none: "", sm: "shadow-sm", md: "shadow-md", lg: "shadow-xl" },
      ${TINT_VARIANT_SNIPPET},
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

const thumbVariants = cva(
  "pointer-events-none block rounded-full shadow-sm transition-transform",
  {
    variants: {
      theme: { light: "", dark: "" },
      checked: { true: "", false: "" },
      size: { sm: "h-5 w-5", md: "h-6 w-6", lg: "h-7 w-7" },
    },
    compoundVariants: [
      { theme: "light", checked: true, className: "translate-x-5 bg-neutral-900" },
      { theme: "light", checked: false, className: "translate-x-0.5 bg-neutral-600" },
      { theme: "dark", checked: true, className: "translate-x-6 bg-white" },
      { theme: "dark", checked: false, className: "translate-x-0.5 bg-white/70" },
    ],
    defaultVariants: { size: "md" },
  },
)

export interface GlassSwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange">,
    VariantProps<typeof glassSwitchVariants> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: string
}

export const GlassSwitch = React.forwardRef<HTMLButtonElement, GlassSwitchProps>(
  (
    { className, theme, blur, rounded, intensity, border, size, shadow, tint, checked = false, onCheckedChange, label, ...props },
    ref,
  ) => {
    return (
      <label className="inline-flex cursor-pointer items-center gap-3">
        <button
          ref={ref}
          type="button"
          role="switch"
          aria-checked={checked}
          className={cn(glassSwitchVariants({ theme, blur, rounded, intensity, border, size, shadow, tint }), className)}
          onClick={() => onCheckedChange?.(!checked)}
          {...props}
        >
          <span className={cn(thumbVariants({ theme, checked, size }))} />
        </button>
        {label ? (
          <span className={cn("text-sm font-medium", theme === "dark" ? "text-white" : "text-neutral-900")}>{label}</span>
        ) : null}
      </label>
    )
  },
)
GlassSwitch.displayName = "GlassSwitch"
`
}
