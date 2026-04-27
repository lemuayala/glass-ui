import { getGlassModalClasses } from "../variants"
import type { GlassOptions } from "../types"

/**
 * Inline export — Modal overlay snippet with NativeWind classes.
 * Uses RN `Modal` for the overlay layer.
 */
export function renderGlassModalInline(options: GlassOptions): string {
  const classes = getGlassModalClasses(options).trim().replace(/\s+/g, " ")
  const title = (options.text || "Confirm action").replace(/"/g, '\\"')
  const isDark = options.theme === "dark"
  return `// 👇 Paste this anywhere inside your screen.
// Requires: react-native + nativewind configured.
import { Modal, View, Text, Pressable } from "react-native"
import { useState } from "react"

export function Example() {
  const [open, setOpen] = useState(true)
  return (
    <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
      {/* Dim backdrop */}
      <Pressable onPress={() => setOpen(false)} className="flex-1 items-center justify-center bg-black/50 px-6">
        {/* Glass surface */}
        <View className="${classes} w-full max-w-sm">
          <Text className="text-lg font-semibold ${isDark ? "text-white" : "text-neutral-900"}">
            ${title}
          </Text>
          <Text className="mt-2 text-sm ${isDark ? "text-white/70" : "text-neutral-700"}">
            This action can be undone from the settings panel.
          </Text>
          <View className="mt-6 flex-row justify-end gap-3">
            <Pressable onPress={() => setOpen(false)} className="h-10 items-center justify-center rounded-full px-5">
              <Text className="text-sm font-medium ${isDark ? "text-white/80" : "text-neutral-700"}">Cancel</Text>
            </Pressable>
            <Pressable onPress={() => setOpen(false)} className="h-10 items-center justify-center rounded-full bg-blue-500 px-5">
              <Text className="text-sm font-semibold text-white">Confirm</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  )
}
`
}
