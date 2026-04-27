import { getGlassButtonClasses } from "../variants"
import type { GlassOptions } from "../types"

/**
 * Inline export — Pressable + Text snippet with NativeWind classes applied directly.
 */
export function renderGlassButtonInline(options: GlassOptions): string {
  const classes = getGlassButtonClasses(options).trim().replace(/\s+/g, " ")
  const label = (options.text || "Continue").replace(/"/g, '\\"')

  return `// 👇 Paste this anywhere inside your screen.
// Requires: react-native + nativewind configured.
import { Pressable, Text } from "react-native"

export function Example() {
  return (
    <Pressable className="${classes}">
      <Text className="font-semibold ${
        options.theme === "dark" ? "text-white" : "text-neutral-900"
      }">
        ${label}
      </Text>
    </Pressable>
  )
}
`
}
