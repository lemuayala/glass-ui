import type { GlassOptions } from "../types"
import { TINT_COMPOUNDS_SNIPPET, TINT_VARIANT_SNIPPET } from "./_shared"

/**
 * Reusable export — full <GlassModal /> using CVA + tailwind-merge.
 * Future home: `@glass-ui/native`.
 */
export function renderGlassModalReusable(options: GlassOptions): string {
  return `// glass-modal.tsx
// Drop this file into your project (e.g. components/ui/glass-modal.tsx).
// Requires: react-native, nativewind, class-variance-authority, tailwind-merge, clsx.
import * as React from "react"
import { Modal, View, Pressable, type ViewProps } from "react-native"
import { cva, type VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const glassModalVariants = cva("overflow-hidden", {
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
    padding: { sm: "p-5", md: "p-6", lg: "p-8" },
    shadow: { none: "", sm: "shadow-sm", md: "shadow-md", lg: "shadow-xl" },
    ${TINT_VARIANT_SNIPPET},
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
${TINT_COMPOUNDS_SNIPPET}
  ],
  defaultVariants: {
    theme: "${options.theme}",
    blur: "${options.blur}",
    rounded: "${options.rounded}",
    intensity: "${options.intensity}",
    border: "${options.border}",
    padding: "${options.padding}",
    shadow: "${options.shadow}",
    tint: "${options.tint}",
  },
})

export type GlassModalProps = ViewProps &
  VariantProps<typeof glassModalVariants> & {
    open: boolean
    onClose: () => void
    className?: string
    children?: React.ReactNode
  }

/**
 * <GlassModal /> — frosted-glass overlay surface for React Native + NativeWind.
 *
 * @example
 * <GlassModal open={open} onClose={() => setOpen(false)} theme="dark">
 *   <Text className="text-white">Hello</Text>
 * </GlassModal>
 */
export const GlassModal = React.forwardRef<View, GlassModalProps>(
  (
    { theme, blur, rounded, intensity, border, padding, shadow, tint, open, onClose, className, children, ...props },
    ref,
  ) => {
    return (
      <Modal transparent visible={open} animationType="fade" onRequestClose={onClose}>
        <Pressable onPress={onClose} className="flex-1 items-center justify-center bg-black/50 px-6">
          <View
            ref={ref}
            className={cn(
              "w-full max-w-sm",
              glassModalVariants({ theme, blur, rounded, intensity, border, padding, shadow, tint }),
              className,
            )}
            {...props}
          >
            {children}
          </View>
        </Pressable>
      </Modal>
    )
  },
)
GlassModal.displayName = "GlassModal"
`
}
