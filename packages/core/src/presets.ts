import type { ComponentKind, GlassOptions } from "./types.js"

export const ALL_COMPONENTS: readonly ComponentKind[] = [
  "glass-card",
  "glass-button",
  "glass-input",
  "glass-modal",
  "glass-tabbar",
  "glass-switch",
  "glass-navbar",
]

export function defaultsForComponent(component: ComponentKind): GlassOptions {
  switch (component) {
    case "glass-button":
      return {
        theme: "dark",
        blur: "md",
        rounded: "full",
        intensity: "medium",
        border: "subtle",
        padding: "md",
        shadow: "md",
        tint: "none",
        text: "Continue",
      }
    case "glass-input":
      return {
        theme: "dark",
        blur: "md",
        rounded: "xl",
        intensity: "medium",
        border: "subtle",
        padding: "md",
        shadow: "sm",
        tint: "none",
        text: "Search…",
      }
    case "glass-modal":
      return {
        theme: "dark",
        blur: "xl",
        rounded: "3xl",
        intensity: "medium",
        border: "subtle",
        padding: "lg",
        shadow: "lg",
        tint: "none",
        text: "Confirm action",
      }
    case "glass-tabbar":
      return {
        theme: "dark",
        blur: "xl",
        rounded: "full",
        intensity: "medium",
        border: "subtle",
        padding: "md",
        shadow: "lg",
        tint: "none",
        text: "",
      }
    case "glass-switch":
      return {
        theme: "dark",
        blur: "md",
        rounded: "full",
        intensity: "medium",
        border: "subtle",
        padding: "md",
        shadow: "sm",
        tint: "none",
        text: "Notifications",
      }
    case "glass-navbar":
      return {
        theme: "dark",
        blur: "xl",
        rounded: "none",
        intensity: "medium",
        border: "subtle",
        padding: "md",
        shadow: "sm",
        tint: "none",
        text: "Glass UI",
      }
    case "glass-card":
    default:
      return {
        theme: "light",
        blur: "md",
        rounded: "2xl",
        intensity: "medium",
        border: "subtle",
        padding: "md",
        shadow: "md",
        tint: "none",
        text: "",
      }
  }
}

/**
 * Curated presets — set every option at once with a single click.
 * Inspired by canonical glass styles found in real shipping apps (iOS, macOS,
 * Apple Music, Spotify lyrics, recent "liquid glass" look from iOS 26).
 */
export interface GlassPreset {
  id: string
  name: string
  description: string
  options: GlassOptions
}

export const PRESETS: GlassPreset[] = [
  {
    id: "frosted",
    name: "Frosted",
    description: "Classic light frosted glass — clean, neutral.",
    options: {
      theme: "light",
      blur: "xl",
      rounded: "2xl",
      intensity: "medium",
      border: "subtle",
      padding: "md",
      shadow: "lg",
      tint: "none",
      text: "",
    },
  },
  {
    id: "liquid",
    name: "Liquid Glass",
    description: "iOS 26 inspired — heavy blur, blue tint, soft.",
    options: {
      theme: "dark",
      blur: "xl",
      rounded: "3xl",
      intensity: "subtle",
      border: "subtle",
      padding: "md",
      shadow: "lg",
      tint: "blue",
      text: "",
    },
  },
  {
    id: "smoked",
    name: "Smoked",
    description: "Deep dark glass — strong, opaque, dramatic.",
    options: {
      theme: "dark",
      blur: "lg",
      rounded: "2xl",
      intensity: "strong",
      border: "none",
      padding: "md",
      shadow: "md",
      tint: "none",
      text: "",
    },
  },
  {
    id: "crystal",
    name: "Crystal",
    description: "Almost transparent — for layered hero compositions.",
    options: {
      theme: "light",
      blur: "md",
      rounded: "3xl",
      intensity: "subtle",
      border: "strong",
      padding: "md",
      shadow: "sm",
      tint: "none",
      text: "",
    },
  },
  {
    id: "sunset",
    name: "Sunset",
    description: "Warm orange tint — friendly and inviting.",
    options: {
      theme: "light",
      blur: "lg",
      rounded: "2xl",
      intensity: "medium",
      border: "subtle",
      padding: "md",
      shadow: "md",
      tint: "orange",
      text: "",
    },
  },
  {
    id: "aqua",
    name: "Aqua",
    description: "Teal-tinted glass — fresh and calm.",
    options: {
      theme: "dark",
      blur: "lg",
      rounded: "3xl",
      intensity: "medium",
      border: "subtle",
      padding: "md",
      shadow: "lg",
      tint: "teal",
      text: "",
    },
  },
]

export function applyPreset(preset: GlassPreset, currentText?: string): GlassOptions {
  return { ...preset.options, text: currentText ?? "" }
}

export function findMatchingPreset(options: GlassOptions): GlassPreset | undefined {
  return PRESETS.find(
    (p) =>
      p.options.theme === options.theme &&
      p.options.blur === options.blur &&
      p.options.rounded === options.rounded &&
      p.options.intensity === options.intensity &&
      p.options.border === options.border &&
      p.options.padding === options.padding &&
      p.options.shadow === options.shadow &&
      p.options.tint === options.tint,
  )
}
