import type { GlassOptions, NativeBlurMode } from "../../types.js"
import { getGlassCardClasses } from "../../variants.js"
import {
  BLUR_INTENSITY_MAP,
  BLUR_INTENSITY_SNIPPET,
  TINT_COMPOUNDS_SNIPPET,
  escapeJsxText,
  stripBackdropBlur,
} from "../_shared.js"

export function renderGlassCardNativeReusable(
  options: GlassOptions,
  nativeBlur: NativeBlurMode = "expo-blur",
): string {
  const { theme, blur, rounded, intensity, border, padding, shadow, tint } = options
  const useExpoBlur = nativeBlur === "expo-blur"

  const imports = useExpoBlur
    ? `import * as React from "react"
import { StyleSheet, View, type ViewProps } from "react-native"
import { BlurView } from "expo-blur"`
    : `import * as React from "react"
import { View, type ViewProps } from "react-native"`

  const blurVariantBlock = useExpoBlur
    ? `blur: {
      none: "",
      sm: "",
      md: "",
      lg: "",
      xl: "",
    },`
    : `blur: {
      none: "",
      sm: "backdrop-blur-sm",
      md: "backdrop-blur-md",
      lg: "backdrop-blur-lg",
      xl: "backdrop-blur-xl",
    },`

  return `// glass-card.tsx
// Drop this file into your project (e.g. components/ui/glass-card.tsx).
// Requires: react-native, ${useExpoBlur ? "expo-blur, " : ""}nativewind, class-variance-authority, tailwind-merge, clsx.
${imports}
import { cva, type VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
${useExpoBlur ? `\n${BLUR_INTENSITY_SNIPPET}\n` : ""}
export const glassCardVariants = cva("relative overflow-hidden", {
  variants: {
    theme: {
      light: "",
      dark: "",
    },
    ${blurVariantBlock}
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
    tint: {
      none: "",
      blue: "",
      pink: "",
      orange: "",
      teal: "",
    },
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
${TINT_COMPOUNDS_SNIPPET}
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

export type GlassCardProps = ViewProps &
  VariantProps<typeof glassCardVariants> & {
    className?: string
    children?: React.ReactNode
  }

export const GlassCard = React.forwardRef<View, GlassCardProps>(
  ({ theme = "${theme}", blur = "${blur}", rounded, intensity, border, padding, shadow, tint, className, children, ...props }, ref) => {${
    useExpoBlur
      ? `\n    const blurAmount = BLUR_INTENSITY[blur ?? "${blur}"]`
      : ""
  }
    return (
      <View
        ref={ref}
        className={cn(
          glassCardVariants({ theme, blur, rounded, intensity, border, padding, shadow, tint }),
          className,
        )}
        {...props}
      >${
        useExpoBlur
          ? `
        {blurAmount > 0 ? (
          <BlurView
            intensity={blurAmount}
            tint={theme === "light" ? "light" : "dark"}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
        ) : null}`
          : ""
      }
        {children}
      </View>
    )
  },
)
GlassCard.displayName = "GlassCard"
`
}

export function renderGlassCardNativeInline(
  options: GlassOptions,
  nativeBlur: NativeBlurMode = "expo-blur",
): string {
  const rawClasses = getGlassCardClasses(options).trim().replace(/\s+/g, " ")
  const title = escapeJsxText(options.text || "Glass Card")
  const textColor = options.theme === "dark" ? "text-white" : "text-neutral-900"
  const textMuted = options.theme === "dark" ? "text-white/70" : "text-neutral-700"

  if (nativeBlur === "expo-blur") {
    const classes = `relative ${stripBackdropBlur(rawClasses)}`.trim()
    const blurAmount = BLUR_INTENSITY_MAP[options.blur]
    const blurLayer =
      blurAmount > 0
        ? `\n      <BlurView intensity={${blurAmount}} tint="${options.theme}" style={StyleSheet.absoluteFill} pointerEvents="none" />`
        : ""
    return `// 👇 Paste this anywhere inside your screen.
// Requires: react-native + expo-blur + nativewind configured.
import { StyleSheet, View, Text } from "react-native"
${blurAmount > 0 ? 'import { BlurView } from "expo-blur"\n' : ""}
export function Example() {
  return (
    <View className="${classes}">${blurLayer}
      <Text className="text-base font-semibold ${textColor}">
        ${title}
      </Text>
      <Text className="mt-1 text-sm ${textMuted}">
        Frosted glass surface, Expo + NativeWind ready.
      </Text>
    </View>
  )
}
`
  }

  return `// 👇 Paste this anywhere inside your screen.
// Requires: react-native + nativewind configured.
import { View, Text } from "react-native"

export function Example() {
  return (
    <View className="${rawClasses}">
      <Text className="text-base font-semibold ${textColor}">
        ${title}
      </Text>
      <Text className="mt-1 text-sm ${textMuted}">
        Frosted glass surface, NativeWind ready.
      </Text>
    </View>
  )
}
`
}
