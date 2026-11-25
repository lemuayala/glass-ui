import type { CodegenInput } from "./types.js"
import { escapeJsxAttr, escapeJsxText } from "./templates/_shared.js"
import { renderGlassCardInline } from "./templates/glass-card-inline.js"
import { renderGlassCardReusable } from "./templates/glass-card-reusable.js"
import { renderGlassButtonInline } from "./templates/glass-button-inline.js"
import { renderGlassButtonReusable } from "./templates/glass-button-reusable.js"
import { renderGlassInputInline } from "./templates/glass-input-inline.js"
import { renderGlassInputReusable } from "./templates/glass-input-reusable.js"
import { renderGlassModalInline } from "./templates/glass-modal-inline.js"
import { renderGlassModalReusable } from "./templates/glass-modal-reusable.js"
import { renderGlassTabBarInline } from "./templates/glass-tabbar-inline.js"
import { renderGlassTabBarReusable } from "./templates/glass-tabbar-reusable.js"
import { renderGlassSwitchInline } from "./templates/glass-switch-inline.js"
import { renderGlassSwitchReusable } from "./templates/glass-switch-reusable.js"
import { renderGlassNavbarInline } from "./templates/glass-navbar-inline.js"
import { renderGlassNavbarReusable } from "./templates/glass-navbar-reusable.js"
import {
  renderGlassCardNativeInline,
  renderGlassCardNativeReusable,
} from "./templates/native/glass-card.js"
import {
  renderGlassButtonNativeInline,
  renderGlassButtonNativeReusable,
  renderGlassInputNativeInline,
  renderGlassInputNativeReusable,
  renderGlassModalNativeInline,
  renderGlassModalNativeReusable,
  renderGlassTabBarNativeInline,
  renderGlassTabBarNativeReusable,
} from "./templates/native/others.js"
import {
  renderGlassSwitchNativeInline,
  renderGlassSwitchNativeReusable,
  renderGlassNavbarNativeInline,
  renderGlassNavbarNativeReusable,
} from "./templates/native/switch-navbar.js"

export function generateCode(input: CodegenInput): string {
  const { component, mode, platform, nativeBlur = "expo-blur", options } = input

  switch (component) {
    case "glass-card":
      if (platform === "native")
        return mode === "inline"
          ? renderGlassCardNativeInline(options, nativeBlur)
          : renderGlassCardNativeReusable(options, nativeBlur)
      return mode === "inline" ? renderGlassCardInline(options) : renderGlassCardReusable(options)
    case "glass-button":
      if (platform === "native")
        return mode === "inline"
          ? renderGlassButtonNativeInline(options, nativeBlur)
          : renderGlassButtonNativeReusable(options, nativeBlur)
      return mode === "inline" ? renderGlassButtonInline(options) : renderGlassButtonReusable(options)
    case "glass-input":
      if (platform === "native")
        return mode === "inline"
          ? renderGlassInputNativeInline(options, nativeBlur)
          : renderGlassInputNativeReusable(options, nativeBlur)
      return mode === "inline" ? renderGlassInputInline(options) : renderGlassInputReusable(options)
    case "glass-modal":
      if (platform === "native")
        return mode === "inline"
          ? renderGlassModalNativeInline(options, nativeBlur)
          : renderGlassModalNativeReusable(options, nativeBlur)
      return mode === "inline" ? renderGlassModalInline(options) : renderGlassModalReusable(options)
    case "glass-tabbar":
      if (platform === "native")
        return mode === "inline"
          ? renderGlassTabBarNativeInline(options, nativeBlur)
          : renderGlassTabBarNativeReusable(options, nativeBlur)
      return mode === "inline" ? renderGlassTabBarInline(options) : renderGlassTabBarReusable(options)
    case "glass-switch":
      if (platform === "native")
        return mode === "inline"
          ? renderGlassSwitchNativeInline(options, nativeBlur)
          : renderGlassSwitchNativeReusable(options, nativeBlur)
      return mode === "inline" ? renderGlassSwitchInline(options) : renderGlassSwitchReusable(options)
    case "glass-navbar":
      if (platform === "native")
        return mode === "inline"
          ? renderGlassNavbarNativeInline(options, nativeBlur)
          : renderGlassNavbarNativeReusable(options, nativeBlur)
      return mode === "inline" ? renderGlassNavbarInline(options) : renderGlassNavbarReusable(options)
    default:
      return "// Unsupported component"
  }
}

export * from "./types.js"
export * from "./variants.js"

export function generateUsageSnippet(
  input: CodegenInput,
  componentPath = "components/ui",
): string {
  const { component, platform, options } = input
  const { theme, blur, rounded, intensity, border, padding, shadow, tint, text } = options
  const textColor = theme === "dark" ? "text-white" : "text-neutral-900"
  const textColorMuted = theme === "dark" ? "text-white/70" : "text-neutral-700"
  const cleanPath = componentPath.trim().replace(/^\/+|\/+$/g, "") || "components/ui"
  const importBase =
    cleanPath.startsWith(".") || cleanPath.startsWith("@/") ? cleanPath : `./${cleanPath}`

  const sharedProps = `theme="${theme}" blur="${blur}" rounded="${rounded}" intensity="${intensity}" border="${border}" shadow="${shadow}"${tint !== "none" ? ` tint="${tint}"` : ""}`

  if (platform === "native") {
    switch (component) {
      case "glass-card": {
        const title = escapeJsxText(text || "Now Playing")
        return `import { GlassCard } from "${importBase}/glass-card"
import { Text } from "react-native"

<GlassCard ${sharedProps} padding="${padding}">
  <Text className="text-base font-semibold ${textColor}">${title}</Text>
  <Text className="mt-1 text-sm ${textColorMuted}">Subtitle goes here</Text>
</GlassCard>`
      }
      case "glass-button": {
        const label = escapeJsxText(text || "Continue")
        return `import { GlassButton } from "${importBase}/glass-button"

<GlassButton ${sharedProps} size="${padding}">
  ${label}
</GlassButton>`
      }
      case "glass-input": {
        const placeholder = escapeJsxAttr(text || "Search…")
        return `import { GlassInput } from "${importBase}/glass-input"

<GlassInput placeholder=${placeholder} ${sharedProps} size="${padding}" />`
      }
      case "glass-modal": {
        const title = escapeJsxText(text || "Confirm action")
        return `import { GlassModal } from "${importBase}/glass-modal"
import { Text } from "react-native"

<GlassModal ${sharedProps} padding="${padding}">
  <Text className="text-base font-semibold ${textColor}">${title}</Text>
</GlassModal>`
      }
      case "glass-tabbar":
        return `import { GlassTabBar } from "${importBase}/glass-tabbar"

<GlassTabBar ${sharedProps} padding="${padding}">
  {/* your tab items here */}
</GlassTabBar>`
      case "glass-switch": {
        const label = escapeJsxAttr(text || "Notifications")
        return `import { GlassSwitch } from "${importBase}/glass-switch"

<GlassSwitch ${sharedProps} size="${padding}" checked label=${label} onCheckedChange={setOn} />`
      }
      case "glass-navbar": {
        const title = escapeJsxAttr(text || "Glass UI")
        return `import { GlassNavigationBar } from "${importBase}/glass-navbar"

<GlassNavigationBar ${sharedProps} padding="${padding}" title=${title} />`
      }
      default:
        return ""
    }
  }

  switch (component) {
    case "glass-card": {
      const title = escapeJsxText(text || "Now Playing")
      return `import { GlassCard } from "${importBase}/glass-card"

<GlassCard ${sharedProps} padding="${padding}">
  <h3 className="text-base font-semibold ${textColor}">${title}</h3>
  <p className="mt-1 text-sm ${textColorMuted}">Subtitle goes here</p>
</GlassCard>`
    }
    case "glass-button": {
      const label = escapeJsxText(text || "Continue")
      return `import { GlassButton } from "${importBase}/glass-button"

<GlassButton ${sharedProps} size="${padding}">
  ${label}
</GlassButton>`
    }
    case "glass-input": {
      const placeholder = escapeJsxAttr(text || "Search…")
      return `import { GlassInput } from "${importBase}/glass-input"

<GlassInput placeholder=${placeholder} ${sharedProps} size="${padding}" />`
    }
    case "glass-modal": {
      const title = escapeJsxText(text || "Confirm action")
      return `import { GlassModal } from "${importBase}/glass-modal"

<GlassModal ${sharedProps} padding="${padding}">
  <h2 className="text-xl font-bold ${textColor}">${title}</h2>
</GlassModal>`
    }
    case "glass-tabbar":
      return `import { GlassTabBar } from "${importBase}/glass-tabbar"

<GlassTabBar ${sharedProps} padding="${padding}">
  {/* your tab items here */}
</GlassTabBar>`
    case "glass-switch": {
      const label = escapeJsxAttr(text || "Notifications")
      return `import { GlassSwitch } from "${importBase}/glass-switch"

<GlassSwitch ${sharedProps} size="${padding}" checked label=${label} onCheckedChange={setOn} />`
    }
    case "glass-navbar": {
      const title = escapeJsxAttr(text || "Glass UI")
      return `import { GlassNavigationBar } from "${importBase}/glass-navbar"

<GlassNavigationBar ${sharedProps} padding="${padding}" title=${title} />`
    }
    default:
      return ""
  }
}
