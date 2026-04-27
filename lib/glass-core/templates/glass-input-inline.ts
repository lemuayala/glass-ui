import { getGlassInputClasses } from "../variants"
import type { GlassOptions } from "../types"

/**
 * Inline export — TextInput snippet with NativeWind classes applied directly.
 */
export function renderGlassInputInline(options: GlassOptions): string {
  const classes = getGlassInputClasses(options).trim().replace(/\s+/g, " ")
  const placeholder = (options.text || "Search…").replace(/"/g, '\\"')

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
      placeholderTextColor="${options.theme === "dark" ? "rgba(255,255,255,0.55)" : "rgba(23,23,23,0.6)"}"
      className="${classes}"
    />
  )
}
`
}
