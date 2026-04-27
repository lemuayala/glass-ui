import type { GlassOptions } from "./types"

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
