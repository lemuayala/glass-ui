import type { GlassOptions } from "../../types"
import {
  getGlassButtonClasses,
  getGlassInputClasses,
  getGlassModalClasses,
  getGlassTabBarClasses,
} from "../../variants"

/* ─────────────────────────────────────────────────────────────────────────────
   BUTTON
───────────────────────────────────────────────────────────────────────────── */

export function renderGlassButtonNativeReusable(options: GlassOptions): string {
  const { theme, blur, rounded, intensity, border, padding, shadow, tint } = options
  return `// glass-button.tsx
// Drop this into components/ui/glass-button.tsx
// Requires: react-native, nativewind, class-variance-authority
import * as React from "react"
import { Pressable, Text, type PressableProps } from "react-native"
import { cva, type VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const glassButtonVariants = cva(
  "items-center justify-center overflow-hidden",
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
      tint: {
        none: "",
        blue: "",
        pink: "",
        orange: "",
        teal: "",
      },
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
      { tint: "blue", intensity: "subtle", className: "bg-blue-500/15" },
      { tint: "blue", intensity: "medium", className: "bg-blue-500/25" },
      { tint: "blue", intensity: "strong", className: "bg-blue-500/40" },
      { tint: "pink", intensity: "subtle", className: "bg-pink-500/15" },
      { tint: "pink", intensity: "medium", className: "bg-pink-500/25" },
      { tint: "pink", intensity: "strong", className: "bg-pink-500/40" },
      { tint: "orange", intensity: "subtle", className: "bg-orange-500/20" },
      { tint: "orange", intensity: "medium", className: "bg-orange-500/30" },
      { tint: "orange", intensity: "strong", className: "bg-orange-500/45" },
      { tint: "teal", intensity: "subtle", className: "bg-teal-500/15" },
      { tint: "teal", intensity: "medium", className: "bg-teal-500/25" },
      { tint: "teal", intensity: "strong", className: "bg-teal-500/40" },
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
>(({ theme, blur, rounded, intensity, border, size, shadow, tint, className, children, ...props }, ref) => {
  return (
    <Pressable
      ref={ref}
      className={cn(
        glassButtonVariants({ theme, blur, rounded, intensity, border, size, shadow, tint }),
        className,
      )}
      {...props}
    >
      <Text className="font-semibold ${theme === "dark" ? "text-white" : "text-neutral-900"}">
        {children}
      </Text>
    </Pressable>
  )
})
GlassButton.displayName = "GlassButton"
`
}

export function renderGlassButtonNativeInline(options: GlassOptions): string {
  const classes = getGlassButtonClasses(options).trim().replace(/\s+/g, " ")
  const label = (options.text || "Continue").replace(/"/g, '\\"')
  const textColor = options.theme === "dark" ? "text-white" : "text-neutral-900"
  return `// 👇 Paste this anywhere inside your screen.
// Requires: react-native + nativewind configured.
import { Pressable, Text } from "react-native"

export function Example() {
  return (
    <Pressable className="${classes}">
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

export function renderGlassInputNativeReusable(options: GlassOptions): string {
  const { theme, blur, rounded, intensity, border, padding, shadow, tint } = options
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
    tint: {
      none: "",
      blue: "",
      pink: "",
      orange: "",
      teal: "",
    },
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
    { tint: "blue", intensity: "subtle", className: "bg-blue-500/15" },
    { tint: "blue", intensity: "medium", className: "bg-blue-500/25" },
    { tint: "blue", intensity: "strong", className: "bg-blue-500/40" },
    { tint: "pink", intensity: "subtle", className: "bg-pink-500/15" },
    { tint: "pink", intensity: "medium", className: "bg-pink-500/25" },
    { tint: "pink", intensity: "strong", className: "bg-pink-500/40" },
    { tint: "orange", intensity: "subtle", className: "bg-orange-500/20" },
    { tint: "orange", intensity: "medium", className: "bg-orange-500/30" },
    { tint: "orange", intensity: "strong", className: "bg-orange-500/45" },
    { tint: "teal", intensity: "subtle", className: "bg-teal-500/15" },
    { tint: "teal", intensity: "medium", className: "bg-teal-500/25" },
    { tint: "teal", intensity: "strong", className: "bg-teal-500/40" },
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

export function renderGlassInputNativeInline(options: GlassOptions): string {
  const classes = getGlassInputClasses(options).trim().replace(/\s+/g, " ")
  const placeholder = (options.text || "Search…").replace(/"/g, '\\"')
  const placeholderColor = options.theme === "dark" ? "rgba(255,255,255,0.55)" : "rgba(23,23,23,0.6)"
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
      placeholder="${placeholder}"
      placeholderTextColor="${placeholderColor}"
      className="${classes}"
    />
  )
}
`
}

/* ─────────────────────────────────────────────────────────────────────────────
   MODAL
───────────────────────────────────────────────────────────────────────────── */

export function renderGlassModalNativeReusable(options: GlassOptions): string {
  const { theme, blur, rounded, intensity, border, padding, shadow, tint } = options
  return `// glass-modal.tsx
// Drop this into components/ui/glass-modal.tsx
// Requires: react-native, nativewind, class-variance-authority
import * as React from "react"
import { View, type ViewProps } from "react-native"
import { cva, type VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const glassModalVariants = cva("overflow-hidden shadow-2xl", {
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
      full: "rounded-full",
    },
    intensity: { subtle: "", medium: "", strong: "" },
    border: { none: "", subtle: "border", strong: "border-2" },
    padding: { sm: "p-6", md: "p-8", lg: "p-10" },
    shadow: { none: "", sm: "shadow-sm", md: "shadow-md", lg: "shadow-xl" },
    tint: {
      none: "",
      blue: "",
      pink: "",
      orange: "",
      teal: "",
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
    { tint: "blue", intensity: "subtle", className: "bg-blue-500/15" },
    { tint: "blue", intensity: "medium", className: "bg-blue-500/25" },
    { tint: "blue", intensity: "strong", className: "bg-blue-500/40" },
    { tint: "pink", intensity: "subtle", className: "bg-pink-500/15" },
    { tint: "pink", intensity: "medium", className: "bg-pink-500/25" },
    { tint: "pink", intensity: "strong", className: "bg-pink-500/40" },
    { tint: "orange", intensity: "subtle", className: "bg-orange-500/20" },
    { tint: "orange", intensity: "medium", className: "bg-orange-500/30" },
    { tint: "orange", intensity: "strong", className: "bg-orange-500/45" },
    { tint: "teal", intensity: "subtle", className: "bg-teal-500/15" },
    { tint: "teal", intensity: "medium", className: "bg-teal-500/25" },
    { tint: "teal", intensity: "strong", className: "bg-teal-500/40" },
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
  ({ theme, blur, rounded, intensity, border, padding, shadow, tint, className, children, ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={cn(
          glassModalVariants({ theme, blur, rounded, intensity, border, padding, shadow, tint }),
          className,
        )}
        {...props}
      >
        {children}
      </View>
    )
  },
)
GlassModal.displayName = "GlassModal"
`
}

export function renderGlassModalNativeInline(options: GlassOptions): string {
  const classes = getGlassModalClasses(options).trim().replace(/\s+/g, " ")
  const title = options.text || "Confirm action"
  const textColor = options.theme === "dark" ? "text-white" : "text-neutral-900"
  const textMuted = options.theme === "dark" ? "text-white/70" : "text-neutral-700"
  return `// 👇 Paste this anywhere inside your screen.
// Requires: react-native + nativewind configured.
import { View, Text } from "react-native"

export function Example() {
  return (
    <View className="absolute inset-0 z-50 items-center justify-center bg-black/20">
      <View className="${classes}">
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

export function renderGlassTabBarNativeReusable(options: GlassOptions): string {
  const { theme, blur, rounded, intensity, border, padding, shadow, tint } = options
  return `// glass-tabbar.tsx
// Drop this into components/ui/glass-tabbar.tsx
// Requires: react-native, nativewind, class-variance-authority
import * as React from "react"
import { View, type ViewProps } from "react-native"
import { cva, type VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const glassTabBarVariants = cva(
  "flex-row items-center justify-around overflow-hidden",
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
      tint: {
        none: "",
        blue: "",
        pink: "",
        orange: "",
        teal: "",
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
      { tint: "blue", intensity: "subtle", className: "bg-blue-500/15" },
      { tint: "blue", intensity: "medium", className: "bg-blue-500/25" },
      { tint: "blue", intensity: "strong", className: "bg-blue-500/40" },
      { tint: "pink", intensity: "subtle", className: "bg-pink-500/15" },
      { tint: "pink", intensity: "medium", className: "bg-pink-500/25" },
      { tint: "pink", intensity: "strong", className: "bg-pink-500/40" },
      { tint: "orange", intensity: "subtle", className: "bg-orange-500/20" },
      { tint: "orange", intensity: "medium", className: "bg-orange-500/30" },
      { tint: "orange", intensity: "strong", className: "bg-orange-500/45" },
      { tint: "teal", intensity: "subtle", className: "bg-teal-500/15" },
      { tint: "teal", intensity: "medium", className: "bg-teal-500/25" },
      { tint: "teal", intensity: "strong", className: "bg-teal-500/40" },
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
  ({ theme, blur, rounded, intensity, border, padding, shadow, tint, className, children, ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={cn(
          glassTabBarVariants({ theme, blur, rounded, intensity, border, padding, shadow, tint }),
          className,
        )}
        {...props}
      >
        {children}
      </View>
    )
  },
)
GlassTabBar.displayName = "GlassTabBar"
`
}

export function renderGlassTabBarNativeInline(options: GlassOptions): string {
  const classes = getGlassTabBarClasses(options).trim().replace(/\s+/g, " ")
  const iconBg = options.theme === "dark" ? "bg-white" : "bg-neutral-900"
  const iconMuted = options.theme === "dark" ? "bg-white/30" : "bg-black/20"
  const textActive = options.theme === "dark" ? "text-white" : "text-neutral-900"
  const textMuted = options.theme === "dark" ? "text-white/55" : "text-neutral-700/55"
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
    <View className="${classes}">
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
