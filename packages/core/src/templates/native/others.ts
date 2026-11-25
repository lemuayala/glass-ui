import type { GlassOptions, NativeBlurMode } from "../../types.js"
import {
  getGlassButtonClasses,
  getGlassInputClasses,
  getGlassModalClasses,
  getGlassTabBarClasses,
} from "../../variants.js"
import {
  BLUR_INTENSITY_MAP,
  BLUR_INTENSITY_SNIPPET,
  TINT_COMPOUNDS_SNIPPET,
  escapeJsxAttr,
  escapeJsxText,
  stripBackdropBlur,
} from "../_shared.js"

function blurVariantBlock(useExpoBlur: boolean): string {
  return useExpoBlur
    ? `blur: { none: "", sm: "", md: "", lg: "", xl: "" },`
    : `blur: {
      none: "",
      sm: "backdrop-blur-sm",
      md: "backdrop-blur-md",
      lg: "backdrop-blur-lg",
      xl: "backdrop-blur-xl",
    },`
}

/* ─────────────────────────────────────────────────────────────────────────────
   BUTTON
───────────────────────────────────────────────────────────────────────────── */

export function renderGlassButtonNativeReusable(
  options: GlassOptions,
  nativeBlur: NativeBlurMode = "expo-blur",
): string {
  const { theme, blur, rounded, intensity, border, padding, shadow, tint } = options
  const useExpoBlur = nativeBlur === "expo-blur"
  return `// glass-button.tsx
// Drop this into components/ui/glass-button.tsx
// Requires: react-native, ${useExpoBlur ? "expo-blur, " : ""}nativewind, class-variance-authority
import * as React from "react"
import { ${useExpoBlur ? "StyleSheet, " : ""}Pressable, Text, type PressableProps } from "react-native"${
    useExpoBlur ? '\nimport { BlurView } from "expo-blur"' : ""
  }
import { cva, type VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
${useExpoBlur ? `\n${BLUR_INTENSITY_SNIPPET}\n` : ""}
export const glassButtonVariants = cva(
  "relative items-center justify-center overflow-hidden",
  {
    variants: {
      theme: { light: "", dark: "" },
      ${blurVariantBlock(useExpoBlur)}
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
        sm: "h-8 px-3",
        md: "h-10 px-5",
        lg: "h-12 px-7",
      },
      shadow: { none: "", sm: "shadow-sm", md: "shadow-md", lg: "shadow-xl" },
      tint: { none: "", blue: "", pink: "", orange: "", teal: "" },
    },
    compoundVariants: [
      { theme: "light", intensity: "subtle", className: "bg-white/15" },
      { theme: "light", intensity: "medium", className: "bg-white/30" },
      { theme: "light", intensity: "strong", className: "bg-white/50" },
      { theme: "dark", intensity: "subtle", className: "bg-white/10" },
      { theme: "dark", intensity: "medium", className: "bg-white/15" },
      { theme: "dark", intensity: "strong", className: "bg-white/25" },
      { theme: "light", border: "subtle", className: "border-white/40" },
      { theme: "light", border: "strong", className: "border-white/60" },
      { theme: "dark", border: "subtle", className: "border-white/15" },
      { theme: "dark", border: "strong", className: "border-white/25" },
${TINT_COMPOUNDS_SNIPPET}
    ],
    defaultVariants: {
      theme: "${theme}",
      blur: "${blur}",
      rounded: "${rounded}",
      intensity: "${intensity}",
      border: "${border}",
      size: "${padding}",
      shadow: "${shadow}",
      tint: "${tint}",
    },
  },
)

export type GlassButtonProps = Omit<PressableProps, "children"> &
  VariantProps<typeof glassButtonVariants> & {
    className?: string
    children?: React.ReactNode
  }

export const GlassButton = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  GlassButtonProps
>(({ theme = "${theme}", blur = "${blur}", rounded, intensity, border, size, shadow, tint, className, children, ...props }, ref) => {${
    useExpoBlur ? `\n  const blurAmount = BLUR_INTENSITY[blur ?? "${blur}"]` : ""
  }
  return (
    <Pressable
      ref={ref}
      className={cn(
        glassButtonVariants({ theme, blur, rounded, intensity, border, size, shadow, tint }),
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
      <Text className={\`font-semibold \${theme === "light" ? "text-neutral-900" : "text-white"}\`}>
        {children}
      </Text>
    </Pressable>
  )
})
GlassButton.displayName = "GlassButton"
`
}

export function renderGlassButtonNativeInline(
  options: GlassOptions,
  nativeBlur: NativeBlurMode = "expo-blur",
): string {
  const rawClasses = getGlassButtonClasses(options).trim().replace(/\s+/g, " ")
  const label = escapeJsxText(options.text || "Continue")
  const textColor = options.theme === "dark" ? "text-white" : "text-neutral-900"

  if (nativeBlur === "expo-blur") {
    const classes = `relative ${stripBackdropBlur(rawClasses)}`.trim()
    const blurAmount = BLUR_INTENSITY_MAP[options.blur]
    const blurLayer =
      blurAmount > 0
        ? `\n      <BlurView intensity={${blurAmount}} tint="${options.theme}" style={StyleSheet.absoluteFill} pointerEvents="none" />`
        : ""
    return `// 👇 Paste this anywhere inside your screen.
// Requires: react-native + expo-blur + nativewind configured.
import { StyleSheet, Pressable, Text } from "react-native"
${blurAmount > 0 ? 'import { BlurView } from "expo-blur"\n' : ""}
export function Example() {
  return (
    <Pressable className="${classes}">${blurLayer}
      <Text className="font-semibold ${textColor}">
        ${label}
      </Text>
    </Pressable>
  )
}
`
  }

  return `// 👇 Paste this anywhere inside your screen.
// Requires: react-native + nativewind configured.
import { Pressable, Text } from "react-native"

export function Example() {
  return (
    <Pressable className="${rawClasses}">
      <Text className="font-semibold ${textColor}">
        ${label}
      </Text>
    </Pressable>
  )
}
`
}

/* ─────────────────────────────────────────────────────────────────────────────
   INPUT
───────────────────────────────────────────────────────────────────────────── */

export function renderGlassInputNativeReusable(
  options: GlassOptions,
  nativeBlur: NativeBlurMode = "expo-blur",
): string {
  const { theme, blur, rounded, intensity, border, padding, shadow, tint } = options
  const useExpoBlur = nativeBlur === "expo-blur"

  if (useExpoBlur) {
    return `// glass-input.tsx
// Drop this into components/ui/glass-input.tsx
// Requires: react-native, expo-blur, nativewind, class-variance-authority
import * as React from "react"
import { StyleSheet, TextInput, View, type TextInputProps } from "react-native"
import { BlurView } from "expo-blur"
import { cva, type VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

${BLUR_INTENSITY_SNIPPET}

export const glassInputVariants = cva("relative w-full justify-center overflow-hidden", {
  variants: {
    theme: { light: "", dark: "" },
    blur: { none: "", sm: "", md: "", lg: "", xl: "" },
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
      sm: "h-8 px-3",
      md: "h-10 px-4",
      lg: "h-12 px-5",
    },
    shadow: { none: "", sm: "shadow-sm", md: "shadow-md", lg: "shadow-xl" },
    tint: { none: "", blue: "", pink: "", orange: "", teal: "" },
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
    size: "${padding}",
    shadow: "${shadow}",
    tint: "${tint}",
  },
})

export type GlassInputProps = TextInputProps &
  VariantProps<typeof glassInputVariants> & {
    className?: string
  }

export const GlassInput = React.forwardRef<
  React.ElementRef<typeof TextInput>,
  GlassInputProps
>(({ theme = "${theme}", blur = "${blur}", rounded, intensity, border, size = "${padding}", shadow, tint, className, ...props }, ref) => {
  const blurAmount = BLUR_INTENSITY[blur ?? "${blur}"]
  const textSize = size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm"
  const textColor = theme === "light" ? "text-neutral-900" : "text-white"
  const placeholderColor = theme === "light" ? "rgba(23,23,23,0.5)" : "rgba(255,255,255,0.45)"
  return (
    <View
      className={cn(
        glassInputVariants({ theme, blur, rounded, intensity, border, size, shadow, tint }),
        className,
      )}
    >
      {blurAmount > 0 ? (
        <BlurView
          intensity={blurAmount}
          tint={theme === "light" ? "light" : "dark"}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
      ) : null}
      <TextInput
        ref={ref}
        className={\`h-full w-full bg-transparent \${textSize} \${textColor}\`}
        placeholderTextColor={placeholderColor}
        {...props}
      />
    </View>
  )
})
GlassInput.displayName = "GlassInput"
`
  }

  return `// glass-input.tsx
// Drop this into components/ui/glass-input.tsx
// Requires: react-native, nativewind, class-variance-authority
import * as React from "react"
import { TextInput, type TextInputProps } from "react-native"
import { cva, type VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const glassInputVariants = cva("w-full", {
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
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-5 text-base",
    },
    shadow: { none: "", sm: "shadow-sm", md: "shadow-md", lg: "shadow-xl" },
    tint: { none: "", blue: "", pink: "", orange: "", teal: "" },
  },
  compoundVariants: [
    { theme: "light", intensity: "subtle", className: "bg-white/10 text-neutral-900" },
    { theme: "light", intensity: "medium", className: "bg-white/20 text-neutral-900" },
    { theme: "light", intensity: "strong", className: "bg-white/40 text-neutral-900" },
    { theme: "dark", intensity: "subtle", className: "bg-black/20 text-white" },
    { theme: "dark", intensity: "medium", className: "bg-black/40 text-white" },
    { theme: "dark", intensity: "strong", className: "bg-black/60 text-white" },
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
    size: "${padding}",
    shadow: "${shadow}",
    tint: "${tint}",
  },
})

export type GlassInputProps = TextInputProps &
  VariantProps<typeof glassInputVariants> & {
    className?: string
  }

export const GlassInput = React.forwardRef<
  React.ElementRef<typeof TextInput>,
  GlassInputProps
>(({ theme, blur, rounded, intensity, border, size, shadow, tint, className, ...props }, ref) => {
  return (
    <TextInput
      ref={ref}
      className={cn(
        glassInputVariants({ theme, blur, rounded, intensity, border, size, shadow, tint }),
        className,
      )}
      placeholderTextColor="${theme === "dark" ? "rgba(255,255,255,0.45)" : "rgba(23,23,23,0.5)"}"
      {...props}
    />
  )
})
GlassInput.displayName = "GlassInput"
`
}

export function renderGlassInputNativeInline(
  options: GlassOptions,
  nativeBlur: NativeBlurMode = "expo-blur",
): string {
  const rawClasses = getGlassInputClasses(options).trim().replace(/\s+/g, " ")
  const placeholder = escapeJsxAttr(options.text || "Search…")
  const placeholderColor =
    options.theme === "dark" ? "rgba(255,255,255,0.55)" : "rgba(23,23,23,0.6)"

  if (nativeBlur === "expo-blur") {
    const wrapperClasses = `relative overflow-hidden ${stripBackdropBlur(rawClasses)}`.trim()
    const blurAmount = BLUR_INTENSITY_MAP[options.blur]
    const textColor = options.theme === "dark" ? "text-white" : "text-neutral-900"
    const blurLayer =
      blurAmount > 0
        ? `\n      <BlurView intensity={${blurAmount}} tint="${options.theme}" style={StyleSheet.absoluteFill} pointerEvents="none" />`
        : ""
    return `// 👇 Paste this anywhere inside your screen.
// Requires: react-native + expo-blur + nativewind configured.
import { StyleSheet, TextInput, View } from "react-native"
${blurAmount > 0 ? 'import { BlurView } from "expo-blur"\n' : ""}import { useState } from "react"

export function Example() {
  const [value, setValue] = useState("")
  return (
    <View className="${wrapperClasses}">${blurLayer}
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder=${placeholder}
        placeholderTextColor="${placeholderColor}"
        className="h-full w-full bg-transparent ${textColor}"
      />
    </View>
  )
}
`
  }

  return `// 👇 Paste this anywhere inside your screen.
// Requires: react-native + nativewind configured.
import { TextInput } from "react-native"
import { useState } from "react"

export function Example() {
  const [value, setValue] = useState("")
  return (
    <TextInput
      value={value}
      onChangeText={setValue}
      placeholder=${placeholder}
      placeholderTextColor="${placeholderColor}"
      className="${rawClasses}"
    />
  )
}
`
}

/* ─────────────────────────────────────────────────────────────────────────────
   MODAL
───────────────────────────────────────────────────────────────────────────── */

export function renderGlassModalNativeReusable(
  options: GlassOptions,
  nativeBlur: NativeBlurMode = "expo-blur",
): string {
  const { theme, blur, rounded, intensity, border, padding, shadow, tint } = options
  const useExpoBlur = nativeBlur === "expo-blur"
  return `// glass-modal.tsx
// Drop this into components/ui/glass-modal.tsx
// Requires: react-native, ${useExpoBlur ? "expo-blur, " : ""}nativewind, class-variance-authority
import * as React from "react"
import { ${useExpoBlur ? "StyleSheet, " : ""}View, type ViewProps } from "react-native"${
    useExpoBlur ? '\nimport { BlurView } from "expo-blur"' : ""
  }
import { cva, type VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
${useExpoBlur ? `\n${BLUR_INTENSITY_SNIPPET}\n` : ""}
export const glassModalVariants = cva("relative overflow-hidden shadow-2xl", {
  variants: {
    theme: { light: "", dark: "" },
    ${blurVariantBlock(useExpoBlur)}
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
    padding: { sm: "p-6", md: "p-8", lg: "p-10" },
    shadow: { none: "", sm: "shadow-sm", md: "shadow-md", lg: "shadow-xl" },
    tint: { none: "", blue: "", pink: "", orange: "", teal: "" },
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

export type GlassModalProps = ViewProps &
  VariantProps<typeof glassModalVariants> & {
    className?: string
    children?: React.ReactNode
  }

export const GlassModal = React.forwardRef<View, GlassModalProps>(
  ({ theme = "${theme}", blur = "${blur}", rounded, intensity, border, padding, shadow, tint, className, children, ...props }, ref) => {${
    useExpoBlur ? `\n    const blurAmount = BLUR_INTENSITY[blur ?? "${blur}"]` : ""
  }
    return (
      <View
        ref={ref}
        className={cn(
          glassModalVariants({ theme, blur, rounded, intensity, border, padding, shadow, tint }),
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
GlassModal.displayName = "GlassModal"
`
}

export function renderGlassModalNativeInline(
  options: GlassOptions,
  nativeBlur: NativeBlurMode = "expo-blur",
): string {
  const rawClasses = getGlassModalClasses(options).trim().replace(/\s+/g, " ")
  const title = escapeJsxText(options.text || "Confirm action")
  const textColor = options.theme === "dark" ? "text-white" : "text-neutral-900"
  const textMuted = options.theme === "dark" ? "text-white/70" : "text-neutral-700"

  if (nativeBlur === "expo-blur") {
    const classes = `relative ${stripBackdropBlur(rawClasses)}`.trim()
    const blurAmount = BLUR_INTENSITY_MAP[options.blur]
    const blurLayer =
      blurAmount > 0
        ? `\n        <BlurView intensity={${blurAmount}} tint="${options.theme}" style={StyleSheet.absoluteFill} pointerEvents="none" />`
        : ""
    return `// 👇 Paste this anywhere inside your screen.
// Requires: react-native + expo-blur + nativewind configured.
import { StyleSheet, View, Text } from "react-native"
${blurAmount > 0 ? 'import { BlurView } from "expo-blur"\n' : ""}
export function Example() {
  return (
    <View className="absolute inset-0 z-50 items-center justify-center bg-black/20">
      <View className="${classes}">${blurLayer}
        <Text className="text-base font-semibold ${textColor}">
          ${title}
        </Text>
        <Text className="mt-1.5 text-sm ${textMuted}">
          This action can be undone from settings.
        </Text>
      </View>
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
    <View className="absolute inset-0 z-50 items-center justify-center bg-black/20">
      <View className="${rawClasses}">
        <Text className="text-base font-semibold ${textColor}">
          ${title}
        </Text>
        <Text className="mt-1.5 text-sm ${textMuted}">
          This action can be undone from settings.
        </Text>
      </View>
    </View>
  )
}
`
}

/* ─────────────────────────────────────────────────────────────────────────────
   TAB BAR
───────────────────────────────────────────────────────────────────────────── */

export function renderGlassTabBarNativeReusable(
  options: GlassOptions,
  nativeBlur: NativeBlurMode = "expo-blur",
): string {
  const { theme, blur, rounded, intensity, border, padding, shadow, tint } = options
  const useExpoBlur = nativeBlur === "expo-blur"
  return `// glass-tabbar.tsx
// Drop this into components/ui/glass-tabbar.tsx
// Requires: react-native, ${useExpoBlur ? "expo-blur, " : ""}nativewind, class-variance-authority
import * as React from "react"
import { ${useExpoBlur ? "StyleSheet, " : ""}View, type ViewProps } from "react-native"${
    useExpoBlur ? '\nimport { BlurView } from "expo-blur"' : ""
  }
import { cva, type VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
${useExpoBlur ? `\n${BLUR_INTENSITY_SNIPPET}\n` : ""}
export const glassTabBarVariants = cva(
  "relative flex-row items-center justify-around overflow-hidden",
  {
    variants: {
      theme: { light: "", dark: "" },
      ${blurVariantBlock(useExpoBlur)}
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
        sm: "h-12 px-4",
        md: "h-14 px-6",
        lg: "h-16 px-8",
      },
      shadow: { none: "", sm: "shadow-sm", md: "shadow-md", lg: "shadow-xl" },
      tint: { none: "", blue: "", pink: "", orange: "", teal: "" },
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
  },
)

export type GlassTabBarProps = ViewProps &
  VariantProps<typeof glassTabBarVariants> & {
    className?: string
    children?: React.ReactNode
  }

export const GlassTabBar = React.forwardRef<View, GlassTabBarProps>(
  ({ theme = "${theme}", blur = "${blur}", rounded, intensity, border, padding, shadow, tint, className, children, ...props }, ref) => {${
    useExpoBlur ? `\n    const blurAmount = BLUR_INTENSITY[blur ?? "${blur}"]` : ""
  }
    return (
      <View
        ref={ref}
        className={cn(
          glassTabBarVariants({ theme, blur, rounded, intensity, border, padding, shadow, tint }),
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
GlassTabBar.displayName = "GlassTabBar"
`
}

export function renderGlassTabBarNativeInline(
  options: GlassOptions,
  nativeBlur: NativeBlurMode = "expo-blur",
): string {
  const rawClasses = getGlassTabBarClasses(options).trim().replace(/\s+/g, " ")
  const iconBg = options.theme === "dark" ? "bg-white" : "bg-neutral-900"
  const iconMuted = options.theme === "dark" ? "bg-white/30" : "bg-black/20"
  const textActive = options.theme === "dark" ? "text-white" : "text-neutral-900"
  const textMuted = options.theme === "dark" ? "text-white/55" : "text-neutral-700/55"

  if (nativeBlur === "expo-blur") {
    const classes = `relative ${stripBackdropBlur(rawClasses)}`.trim()
    const blurAmount = BLUR_INTENSITY_MAP[options.blur]
    const blurLayer =
      blurAmount > 0
        ? `\n      <BlurView intensity={${blurAmount}} tint="${options.theme}" style={StyleSheet.absoluteFill} pointerEvents="none" />`
        : ""
    return `// 👇 Paste this anywhere inside your screen.
// Requires: react-native + expo-blur + nativewind configured.
import { StyleSheet, View, Text, Pressable } from "react-native"
${blurAmount > 0 ? 'import { BlurView } from "expo-blur"\n' : ""}import { useState } from "react"

export function Example() {
  const [active, setActive] = useState("home")
  const tabs = [
    { id: "home", label: "Home" },
    { id: "search", label: "Search" },
    { id: "saved", label: "Saved" },
    { id: "profile", label: "Profile" },
  ]
  return (
    <View className="${classes}">${blurLayer}
      {tabs.map(({ id, label }) => (
        <Pressable key={id} onPress={() => setActive(id)} className="flex-1 items-center justify-center gap-0.5">
          <View className={\`h-5 w-5 rounded-full \${active === id ? "${iconBg}" : "${iconMuted}"}\`} />
          <Text className={\`text-[10px] font-medium \${active === id ? "${textActive}" : "${textMuted}"}\`}>
            {label}
          </Text>
        </Pressable>
      ))}
    </View>
  )
}
`
  }

  return `// 👇 Paste this anywhere inside your screen.
// Requires: react-native + nativewind configured.
import { View, Text, Pressable } from "react-native"
import { useState } from "react"

export function Example() {
  const [active, setActive] = useState("home")
  const tabs = [
    { id: "home", label: "Home" },
    { id: "search", label: "Search" },
    { id: "saved", label: "Saved" },
    { id: "profile", label: "Profile" },
  ]
  return (
    <View className="${rawClasses}">
      {tabs.map(({ id, label }) => (
        <Pressable key={id} onPress={() => setActive(id)} className="flex-1 items-center justify-center gap-0.5">
          <View className={\`h-5 w-5 rounded-full \${active === id ? "${iconBg}" : "${iconMuted}"}\`} />
          <Text className={\`text-[10px] font-medium \${active === id ? "${textActive}" : "${textMuted}"}\`}>
            {label}
          </Text>
        </Pressable>
      ))}
    </View>
  )
}
`
}
