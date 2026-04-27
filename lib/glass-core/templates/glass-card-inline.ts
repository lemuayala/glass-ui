import { getGlassCardClasses } from "../variants"
import type { GlassOptions } from "../types"

/**
 * Inline export — a single React Native View + Text snippet
 * with all NativeWind classes applied directly.
 *
 * Drop this anywhere in your screen / component file.
 */
export function renderGlassCardInline(options: GlassOptions): string {
  const classes = getGlassCardClasses(options).trim().replace(/\s+/g, " ")

  return `// 👇 Paste this anywhere inside your screen.
// Requires: react-native + nativewind configured.
import { View, Text } from "react-native"

export function Example() {
  return (
    <View className="${classes}">
      <Text className="text-base font-semibold ${
        options.theme === "dark" ? "text-white" : "text-neutral-900"
      }">
        Glass Card
      </Text>
      <Text className="mt-1 text-sm ${
        options.theme === "dark" ? "text-white/70" : "text-neutral-700"
      }">
        Frosted glass surface, NativeWind ready.
      </Text>
    </View>
  )
}
`
}
