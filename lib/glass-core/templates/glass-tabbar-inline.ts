import { getGlassTabBarClasses } from "../variants"
import type { GlassOptions } from "../types"

/**
 * Inline export — TabBar snippet with NativeWind classes.
 */
export function renderGlassTabBarInline(options: GlassOptions): string {
  const classes = getGlassTabBarClasses(options).trim().replace(/\s+/g, " ")
  const isDark = options.theme === "dark"
  return `// 👇 Paste this anywhere inside your screen.
// Requires: react-native + nativewind + lucide-react-native (or any icon set).
import { View, Pressable, Text } from "react-native"
import { Home, Search, Heart, User } from "lucide-react-native"
import { useState } from "react"

export function Example() {
  const [active, setActive] = useState("home")
  const tabs = [
    { id: "home", label: "Home", Icon: Home },
    { id: "search", label: "Search", Icon: Search },
    { id: "saved", label: "Saved", Icon: Heart },
    { id: "profile", label: "Profile", Icon: User },
  ]
  return (
    <View className="${classes}">
      {tabs.map(({ id, label, Icon }) => {
        const isActive = id === active
        return (
          <Pressable key={id} onPress={() => setActive(id)} className="flex-1 items-center justify-center">
            <Icon size={20} color={isActive ? "${isDark ? "#ffffff" : "#171717"}" : "${isDark ? "rgba(255,255,255,0.55)" : "rgba(23,23,23,0.55)"}"} strokeWidth={2.2} />
            <Text className={\`mt-0.5 text-[10px] font-medium \${isActive ? "${isDark ? "text-white" : "text-neutral-900"}" : "${isDark ? "text-white/55" : "text-neutral-700/55"}"}\`}>
              {label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}
`
}
