import type { GlassOptions } from "../../types"
import { getGlassNavbarClasses, getGlassSwitchClasses } from "../../variants"

export function renderGlassSwitchNativeReusable(options: GlassOptions): string {
  const { theme, blur, rounded, intensity, border, padding, shadow, tint } = options
  return `// glass-switch.tsx
import * as React from "react"
import { Pressable, View, Text, type PressableProps } from "react-native"
import { cva, type VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const glassSwitchVariants = cva("relative overflow-hidden", {
  variants: {
    theme: { light: "", dark: "" },
    blur: { none: "", sm: "backdrop-blur-sm", md: "backdrop-blur-md", lg: "backdrop-blur-lg", xl: "backdrop-blur-xl" },
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
    { theme: "dark", intensity: "medium", className: "bg-white/18" },
    { theme: "dark", border: "subtle", className: "border-white/15" },
  ],
  defaultVariants: { theme: "${theme}", blur: "${blur}", rounded: "${rounded}", intensity: "${intensity}", border: "${border}", size: "${padding}", shadow: "${shadow}", tint: "${tint}" },
})

export type GlassSwitchProps = PressableProps &
  VariantProps<typeof glassSwitchVariants> & {
    checked?: boolean
    onCheckedChange?: (v: boolean) => void
    label?: string
  }

export const GlassSwitch = React.forwardRef<typeof Pressable, GlassSwitchProps>(
  ({ checked = false, onCheckedChange, label, theme, blur, rounded, intensity, border, size, shadow, tint, className, ...props }, ref) => {
    const thumb = checked ? (theme === "dark" ? "bg-white ml-6" : "bg-neutral-900 ml-6") : (theme === "dark" ? "bg-white/70 ml-0.5" : "bg-neutral-600 ml-0.5")
    return (
      <View className="flex-row items-center gap-3">
        <Pressable ref={ref} onPress={() => onCheckedChange?.(!checked)} className={cn(glassSwitchVariants({ theme, blur, rounded, intensity, border, size, shadow, tint }), className)} {...props}>
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

export function renderGlassSwitchNativeInline(options: GlassOptions): string {
  const classes = getGlassSwitchClasses(options).trim().replace(/\s+/g, " ")
  const label = options.text || "Notifications"
  const textColor = options.theme === "dark" ? "text-white" : "text-neutral-900"
  return `import { View, Text, Pressable } from "react-native"
import { useState } from "react"

export function Example() {
  const [on, setOn] = useState(true)
  return (
    <View className="flex-row items-center gap-3">
      <Pressable onPress={() => setOn((v) => !v)} className="${classes}">
        <View className={\`h-6 w-6 rounded-full \${on ? "ml-6 bg-white" : "ml-0.5 bg-white/70"}\`} />
      </Pressable>
      <Text className="text-sm font-medium ${textColor}">${label}</Text>
    </View>
  )
}
`
}

export function renderGlassNavbarNativeReusable(options: GlassOptions): string {
  const { theme, blur, rounded, intensity, border, padding, shadow, tint } = options
  return `// glass-navbar.tsx
import * as React from "react"
import { View, Text, type ViewProps } from "react-native"
import { cva, type VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const glassNavbarVariants = cva("flex-row w-full items-center justify-between overflow-hidden", {
  variants: {
    theme: { light: "", dark: "" },
    blur: { none: "", sm: "backdrop-blur-sm", md: "backdrop-blur-md", lg: "backdrop-blur-lg", xl: "backdrop-blur-xl" },
    rounded: { none: "rounded-none", md: "rounded-md", lg: "rounded-lg", xl: "rounded-xl", "2xl": "rounded-2xl", "3xl": "rounded-3xl", full: "rounded-full" },
    intensity: { subtle: "", medium: "", strong: "" },
    border: { none: "", subtle: "border", strong: "border-2" },
    padding: { sm: "h-12 px-3", md: "h-14 px-4", lg: "h-16 px-5" },
    shadow: { none: "", sm: "shadow-sm", md: "shadow-md", lg: "shadow-xl" },
    tint: { none: "", blue: "", pink: "", orange: "", teal: "" },
  },
  compoundVariants: [
    { theme: "dark", intensity: "medium", className: "bg-black/45" },
    { theme: "dark", border: "subtle", className: "border-white/10" },
  ],
  defaultVariants: { theme: "${theme}", blur: "${blur}", rounded: "${rounded}", intensity: "${intensity}", border: "${border}", padding: "${padding}", shadow: "${shadow}", tint: "${tint}" },
})

export type GlassNavigationBarProps = ViewProps &
  VariantProps<typeof glassNavbarVariants> & { title?: string }

export const GlassNavigationBar = React.forwardRef<View, GlassNavigationBarProps>(
  ({ title, theme, blur, rounded, intensity, border, padding, shadow, tint, className, children, ...props }, ref) => {
    const fg = theme === "dark" ? "text-white" : "text-neutral-900"
    return (
      <View ref={ref} className={cn(glassNavbarVariants({ theme, blur, rounded, intensity, border, padding, shadow, tint }), className)} {...props}>
        {children}
        {title ? <Text className={\`flex-1 text-center text-base font-semibold \${fg}\`}>{title}</Text> : null}
      </View>
    )
  },
)
GlassNavigationBar.displayName = "GlassNavigationBar"
`
}

export function renderGlassNavbarNativeInline(options: GlassOptions): string {
  const classes = getGlassNavbarClasses(options).trim().replace(/\s+/g, " ")
  const title = options.text || "Glass UI"
  const fg = options.theme === "dark" ? "text-white" : "text-neutral-900"
  const muted = options.theme === "dark" ? "text-white/60" : "text-neutral-600"
  return `import { View, Text, Pressable } from "react-native"

export function Example() {
  return (
    <View className="${classes}">
      <Pressable><Text className="text-sm ${muted}">Back</Text></Pressable>
      <Text className="text-base font-semibold ${fg}">${title}</Text>
      <Pressable><Text className="text-sm ${muted}">Done</Text></Pressable>
    </View>
  )
}
`
}
