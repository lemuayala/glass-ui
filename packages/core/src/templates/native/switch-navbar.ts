import type { GlassOptions, NativeBlurMode } from "../../types.js"
import { getGlassNavbarClasses, getGlassSwitchClasses } from "../../variants.js"
import {
  BLUR_INTENSITY_MAP,
  BLUR_INTENSITY_SNIPPET,
  TINT_COMPOUNDS_SNIPPET,
  escapeJsxText,
  stripBackdropBlur,
} from "../_shared.js"

export function renderGlassSwitchNativeReusable(
  options: GlassOptions,
  nativeBlur: NativeBlurMode = "expo-blur",
): string {
  const { theme, blur, rounded, intensity, border, padding, shadow, tint } = options
  const useExpoBlur = nativeBlur === "expo-blur"
  const blurVariants = useExpoBlur
    ? `blur: { none: "", sm: "", md: "", lg: "", xl: "" },`
    : `blur: { none: "", sm: "backdrop-blur-sm", md: "backdrop-blur-md", lg: "backdrop-blur-lg", xl: "backdrop-blur-xl" },`

  return `// glass-switch.tsx
import * as React from "react"
import { ${useExpoBlur ? "StyleSheet, " : ""}Pressable, View, Text, type PressableProps } from "react-native"${
    useExpoBlur ? '\nimport { BlurView } from "expo-blur"' : ""
  }
import { cva, type VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
${useExpoBlur ? `\n${BLUR_INTENSITY_SNIPPET}\n` : ""}
export const glassSwitchVariants = cva("relative justify-center overflow-hidden", {
  variants: {
    theme: { light: "", dark: "" },
    ${blurVariants}
    rounded: { none: "rounded-none", md: "rounded-md", lg: "rounded-lg", xl: "rounded-xl", "2xl": "rounded-2xl", "3xl": "rounded-3xl", full: "rounded-full" },
    intensity: { subtle: "", medium: "", strong: "" },
    border: { none: "", subtle: "border", strong: "border-2" },
    size: { sm: "h-7 w-12", md: "h-8 w-14", lg: "h-9 w-16" },
    shadow: { none: "", sm: "shadow-sm", md: "shadow-md", lg: "shadow-xl" },
    tint: { none: "", blue: "", pink: "", orange: "", teal: "" },
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
  defaultVariants: { theme: "${theme}", blur: "${blur}", rounded: "${rounded}", intensity: "${intensity}", border: "${border}", size: "${padding}", shadow: "${shadow}", tint: "${tint}" },
})

export type GlassSwitchProps = PressableProps &
  VariantProps<typeof glassSwitchVariants> & {
    className?: string
    checked?: boolean
    onCheckedChange?: (v: boolean) => void
    label?: string
  }

export const GlassSwitch = React.forwardRef<React.ElementRef<typeof Pressable>, GlassSwitchProps>(
  ({ checked = false, onCheckedChange, label, theme = "${theme}", blur = "${blur}", rounded, intensity, border, size, shadow, tint, className, ...props }, ref) => {${
    useExpoBlur ? `\n    const blurAmount = BLUR_INTENSITY[blur ?? "${blur}"]` : ""
  }
    const thumb = checked ? (theme === "dark" ? "bg-white ml-6" : "bg-neutral-900 ml-6") : (theme === "dark" ? "bg-white/70 ml-0.5" : "bg-neutral-600 ml-0.5")
    return (
      <View className="flex-row items-center gap-3">
        <Pressable ref={ref} onPress={() => onCheckedChange?.(!checked)} className={cn(glassSwitchVariants({ theme, blur, rounded, intensity, border, size, shadow, tint }), className)} {...props}>${
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
          <View className={\`h-6 w-6 rounded-full \${thumb}\`} />
        </Pressable>
        {label ? <Text className={theme === "dark" ? "text-white text-sm" : "text-neutral-900 text-sm"}>{label}</Text> : null}
      </View>
    )
  },
)
GlassSwitch.displayName = "GlassSwitch"
`
}

export function renderGlassSwitchNativeInline(
  options: GlassOptions,
  nativeBlur: NativeBlurMode = "expo-blur",
): string {
  const rawClasses = getGlassSwitchClasses(options).trim().replace(/\s+/g, " ")
  const label = escapeJsxText(options.text || "Notifications")
  const textColor = options.theme === "dark" ? "text-white" : "text-neutral-900"

  if (nativeBlur === "expo-blur") {
    const classes = `relative justify-center ${stripBackdropBlur(rawClasses)}`.trim()
    const blurAmount = BLUR_INTENSITY_MAP[options.blur]
    const blurLayer =
      blurAmount > 0
        ? `\n        <BlurView intensity={${blurAmount}} tint="${options.theme}" style={StyleSheet.absoluteFill} pointerEvents="none" />`
        : ""
    return `import { StyleSheet, View, Text, Pressable } from "react-native"
${blurAmount > 0 ? 'import { BlurView } from "expo-blur"\n' : ""}import { useState } from "react"

export function Example() {
  const [on, setOn] = useState(true)
  return (
    <View className="flex-row items-center gap-3">
      <Pressable onPress={() => setOn((v) => !v)} className="${classes}">${blurLayer}
        <View className={\`h-6 w-6 rounded-full \${on ? "ml-6 bg-white" : "ml-0.5 bg-white/70"}\`} />
      </Pressable>
      <Text className="text-sm font-medium ${textColor}">${label}</Text>
    </View>
  )
}
`
  }

  return `import { View, Text, Pressable } from "react-native"
import { useState } from "react"

export function Example() {
  const [on, setOn] = useState(true)
  return (
    <View className="flex-row items-center gap-3">
      <Pressable onPress={() => setOn((v) => !v)} className="${rawClasses}">
        <View className={\`h-6 w-6 rounded-full \${on ? "ml-6 bg-white" : "ml-0.5 bg-white/70"}\`} />
      </Pressable>
      <Text className="text-sm font-medium ${textColor}">${label}</Text>
    </View>
  )
}
`
}

export function renderGlassNavbarNativeReusable(
  options: GlassOptions,
  nativeBlur: NativeBlurMode = "expo-blur",
): string {
  const { theme, blur, rounded, intensity, border, padding, shadow, tint } = options
  const useExpoBlur = nativeBlur === "expo-blur"
  const blurVariants = useExpoBlur
    ? `blur: { none: "", sm: "", md: "", lg: "", xl: "" },`
    : `blur: { none: "", sm: "backdrop-blur-sm", md: "backdrop-blur-md", lg: "backdrop-blur-lg", xl: "backdrop-blur-xl" },`

  return `// glass-navbar.tsx
import * as React from "react"
import { ${useExpoBlur ? "StyleSheet, " : ""}View, Text, type ViewProps } from "react-native"${
    useExpoBlur ? '\nimport { BlurView } from "expo-blur"' : ""
  }
import { cva, type VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
${useExpoBlur ? `\n${BLUR_INTENSITY_SNIPPET}\n` : ""}
export const glassNavbarVariants = cva("relative flex-row w-full items-center justify-between overflow-hidden", {
  variants: {
    theme: { light: "", dark: "" },
    ${blurVariants}
    rounded: { none: "rounded-none", md: "rounded-md", lg: "rounded-lg", xl: "rounded-xl", "2xl": "rounded-2xl", "3xl": "rounded-3xl", full: "rounded-full" },
    intensity: { subtle: "", medium: "", strong: "" },
    border: { none: "", subtle: "border", strong: "border-2" },
    padding: { sm: "h-12 px-3", md: "h-14 px-4", lg: "h-16 px-5" },
    shadow: { none: "", sm: "shadow-sm", md: "shadow-md", lg: "shadow-xl" },
    tint: { none: "", blue: "", pink: "", orange: "", teal: "" },
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
${TINT_COMPOUNDS_SNIPPET}
  ],
  defaultVariants: { theme: "${theme}", blur: "${blur}", rounded: "${rounded}", intensity: "${intensity}", border: "${border}", padding: "${padding}", shadow: "${shadow}", tint: "${tint}" },
})

export type GlassNavigationBarProps = ViewProps &
  VariantProps<typeof glassNavbarVariants> & {
    className?: string
    title?: string
  }

export const GlassNavigationBar = React.forwardRef<View, GlassNavigationBarProps>(
  ({ title, theme = "${theme}", blur = "${blur}", rounded, intensity, border, padding, shadow, tint, className, children, ...props }, ref) => {${
    useExpoBlur ? `\n    const blurAmount = BLUR_INTENSITY[blur ?? "${blur}"]` : ""
  }
    const fg = theme === "dark" ? "text-white" : "text-neutral-900"
    return (
      <View ref={ref} className={cn(glassNavbarVariants({ theme, blur, rounded, intensity, border, padding, shadow, tint }), className)} {...props}>${
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
        {title ? <Text className={\`flex-1 text-center text-base font-semibold \${fg}\`}>{title}</Text> : null}
      </View>
    )
  },
)
GlassNavigationBar.displayName = "GlassNavigationBar"
`
}

export function renderGlassNavbarNativeInline(
  options: GlassOptions,
  nativeBlur: NativeBlurMode = "expo-blur",
): string {
  const rawClasses = getGlassNavbarClasses(options).trim().replace(/\s+/g, " ")
  const title = escapeJsxText(options.text || "Glass UI")
  const fg = options.theme === "dark" ? "text-white" : "text-neutral-900"
  const muted = options.theme === "dark" ? "text-white/60" : "text-neutral-600"

  if (nativeBlur === "expo-blur") {
    const classes = `relative ${stripBackdropBlur(rawClasses)}`.trim()
    const blurAmount = BLUR_INTENSITY_MAP[options.blur]
    const blurLayer =
      blurAmount > 0
        ? `\n      <BlurView intensity={${blurAmount}} tint="${options.theme}" style={StyleSheet.absoluteFill} pointerEvents="none" />`
        : ""
    return `import { StyleSheet, View, Text, Pressable } from "react-native"
${blurAmount > 0 ? 'import { BlurView } from "expo-blur"\n' : ""}
export function Example() {
  return (
    <View className="${classes}">${blurLayer}
      <Pressable><Text className="text-sm ${muted}">Back</Text></Pressable>
      <Text className="text-base font-semibold ${fg}">${title}</Text>
      <Pressable><Text className="text-sm ${muted}">Done</Text></Pressable>
    </View>
  )
}
`
  }

  return `import { View, Text, Pressable } from "react-native"

export function Example() {
  return (
    <View className="${rawClasses}">
      <Pressable><Text className="text-sm ${muted}">Back</Text></Pressable>
      <Text className="text-base font-semibold ${fg}">${title}</Text>
      <Pressable><Text className="text-sm ${muted}">Done</Text></Pressable>
    </View>
  )
}
`
}
