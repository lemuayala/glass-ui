import type { CodegenInput } from "./types"
import { renderGlassCardInline } from "./templates/glass-card-inline"
import { renderGlassCardReusable } from "./templates/glass-card-reusable"
import { renderGlassButtonInline } from "./templates/glass-button-inline"
import { renderGlassButtonReusable } from "./templates/glass-button-reusable"
import { renderGlassInputInline } from "./templates/glass-input-inline"
import { renderGlassInputReusable } from "./templates/glass-input-reusable"
import { renderGlassModalInline } from "./templates/glass-modal-inline"
import { renderGlassModalReusable } from "./templates/glass-modal-reusable"
import { renderGlassTabBarInline } from "./templates/glass-tabbar-inline"
import { renderGlassTabBarReusable } from "./templates/glass-tabbar-reusable"
import { renderGlassCardNativeInline, renderGlassCardNativeReusable } from "./templates/native/glass-card"
import { 
  renderGlassButtonNativeInline,
  renderGlassButtonNativeReusable,
  renderGlassInputNativeInline,
  renderGlassInputNativeReusable,
  renderGlassModalNativeInline,
  renderGlassModalNativeReusable,
  renderGlassTabBarNativeInline,
  renderGlassTabBarNativeReusable,
} from "./templates/native/others"

/**
 * Single entry-point for code generation.
 * Switch on (component, mode) and dispatch to the right template.
 *
 * Adding a new component (Toast, NavBar, Switch...) means:
 *  1. Add it to \`ComponentKind\` in types.ts
 *  2. Create variants + templates following the GlassCard pattern
 *  3. Add a case here
 */
export function generateCode(input: CodegenInput): string {
  const { component, mode, platform, options } = input

  switch (component) {
    case "glass-card":
      if (platform === "native") return mode === "inline" ? renderGlassCardNativeInline(options) : renderGlassCardNativeReusable(options)
      return mode === "inline" ? renderGlassCardInline(options) : renderGlassCardReusable(options)
    case "glass-button":
      if (platform === "native") return mode === "inline" ? renderGlassButtonNativeInline(options) : renderGlassButtonNativeReusable(options)
      return mode === "inline" ? renderGlassButtonInline(options) : renderGlassButtonReusable(options)
    case "glass-input":
      if (platform === "native") return mode === "inline" ? renderGlassInputNativeInline(options) : renderGlassInputNativeReusable(options)
      return mode === "inline" ? renderGlassInputInline(options) : renderGlassInputReusable(options)
    case "glass-modal":
      if (platform === "native") return mode === "inline" ? renderGlassModalNativeInline(options) : renderGlassModalNativeReusable(options)
      return mode === "inline" ? renderGlassModalInline(options) : renderGlassModalReusable(options)
    case "glass-tabbar":
      if (platform === "native") return mode === "inline" ? renderGlassTabBarNativeInline(options) : renderGlassTabBarNativeReusable(options)
      return mode === "inline" ? renderGlassTabBarInline(options) : renderGlassTabBarReusable(options)
    default:
      return "// Unsupported component"
  }
}

export * from "./types"
export * from "./variants"

/**
 * Returns a concise usage snippet showing how to call the reusable component
 * with the user's current options as explicit props.
 */
export function generateUsageSnippet(input: CodegenInput): string {
  const { component, platform, options } = input
  const { theme, blur, rounded, intensity, border, padding, shadow, tint, text } = options
  const textColor = theme === "dark" ? "text-white" : "text-neutral-900"
  const textColorMuted = theme === "dark" ? "text-white/70" : "text-neutral-700"

  const sharedProps = `theme="${theme}" blur="${blur}" rounded="${rounded}" intensity="${intensity}" border="${border}" shadow="${shadow}"${tint !== "none" ? ` tint="${tint}"` : ""}`

  if (platform === "native") {
    switch (component) {
      case "glass-card": {
        const title = text || "Now Playing"
        return `import { GlassCard } from "./components/ui/glass-card"
import { Text } from "react-native"

<GlassCard ${sharedProps} padding="${padding}">
  <Text className="text-base font-semibold ${textColor}">${title}</Text>
  <Text className="mt-1 text-sm ${textColorMuted}">Subtitle goes here</Text>
</GlassCard>`
      }
      case "glass-button": {
        const label = text || "Continue"
        return `import { GlassButton } from "./components/ui/glass-button"

<GlassButton ${sharedProps} size="${padding}">
  ${label}
</GlassButton>`
      }
      case "glass-input": {
        const placeholder = text || "Search…"
        return `import { GlassInput } from "./components/ui/glass-input"

<GlassInput placeholder="${placeholder}" ${sharedProps} size="${padding}" />`
      }
      case "glass-modal": {
        const title = text || "Confirm action"
        return `import { GlassModal } from "./components/ui/glass-modal"

<GlassModal ${sharedProps} padding="${padding}">
  <Text className="text-base font-semibold ${textColor}">${title}</Text>
</GlassModal>`
      }
      case "glass-tabbar":
        return `import { GlassTabBar } from "./components/ui/glass-tabbar"

<GlassTabBar ${sharedProps} padding="${padding}">
  {/* your tab items here */}
</GlassTabBar>`
    }
  }

  // Web
  switch (component) {
    case "glass-card": {
      const title = text || "Now Playing"
      return `import { GlassCard } from "./components/ui/glass-card"

<GlassCard ${sharedProps} padding="${padding}">
  <h3 className="text-base font-semibold ${textColor}">${title}</h3>
  <p className="mt-1 text-sm ${textColorMuted}">Subtitle goes here</p>
</GlassCard>`
    }
    case "glass-button": {
      const label = text || "Continue"
      return `import { GlassButton } from "./components/ui/glass-button"

<GlassButton ${sharedProps} size="${padding}">
  ${label}
</GlassButton>`
    }
    case "glass-input": {
      const placeholder = text || "Search…"
      return `import { GlassInput } from "./components/ui/glass-input"

<GlassInput placeholder="${placeholder}" ${sharedProps} size="${padding}" />`
    }
    case "glass-modal": {
      const title = text || "Confirm action"
      return `import { GlassModal } from "./components/ui/glass-modal"

<GlassModal ${sharedProps} padding="${padding}">
  <h2 className="text-xl font-bold ${textColor}">${title}</h2>
</GlassModal>`
    }
    case "glass-tabbar":
      return `import { GlassTabBar } from "./components/ui/glass-tabbar"

<GlassTabBar ${sharedProps} padding="${padding}">
  {/* your tab items here */}
</GlassTabBar>`
    default:
      return ""
  }
}
