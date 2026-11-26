/**
 * Target project context for GLASS.md integration prompts.
 * Persisted in localStorage — not encoded in share URLs.
 */

import type { NativeBlurMode } from "./types.js"

export type ProjectFramework = "next-app-router" | "vite-react" | "expo" | "other"
export type TailwindVersion = "3" | "4"
export type PackageManager = "npm" | "pnpm" | "yarn"

export interface ProjectProfile {
  framework: ProjectFramework
  tailwindVersion: TailwindVersion
  componentPath: string
  packageManager: PackageManager
  hasCnHelper: boolean
  usesShadcn: boolean
}

export const DEFAULT_PROJECT_PROFILE: ProjectProfile = {
  framework: "next-app-router",
  tailwindVersion: "4",
  componentPath: "components/ui",
  packageManager: "npm",
  hasCnHelper: true,
  usesShadcn: true,
}

export const STORAGE_KEY_PROFILE = "glass-ui-profile-v1"

const FRAMEWORK_LABELS: Record<ProjectFramework, string> = {
  "next-app-router": "Next.js App Router",
  "vite-react": "Vite + React",
  expo: "Expo (React Native)",
  other: "Other / custom stack",
}

export function frameworkLabel(f: ProjectFramework): string {
  return FRAMEWORK_LABELS[f]
}

export function readProjectProfile(): ProjectProfile {
  if (typeof window === "undefined") return DEFAULT_PROJECT_PROFILE
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_PROFILE)
    if (!raw) return DEFAULT_PROJECT_PROFILE
    const parsed = JSON.parse(raw) as Partial<ProjectProfile>
    return { ...DEFAULT_PROJECT_PROFILE, ...parsed }
  } catch {
    return DEFAULT_PROJECT_PROFILE
  }
}

export function writeProjectProfile(profile: ProjectProfile): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile))
  } catch {
    /* quota / private mode */
  }
}

export function getFileStructure(profile: ProjectProfile, fileName: string): string {
  const base = profile.componentPath.replace(/\/$/, "")
  switch (profile.framework) {
    case "next-app-router":
      return `\`\`\`
app/
  globals.css
  layout.tsx
${base}/
  ${fileName}.tsx
lib/
  utils.ts
\`\`\``
    case "vite-react":
      return `\`\`\`
src/
  ${base}/
    ${fileName}.tsx
  lib/utils.ts
  App.tsx
  main.tsx
\`\`\``
    case "expo":
      return `\`\`\`
${base}/
  ${fileName}.tsx
app/
  _layout.tsx
\`\`\``
    default:
      return `\`\`\`
${base}/
  ${fileName}.tsx
\`\`\``
  }
}

/** npm dependencies a generated reusable component needs (single source for install hints and the registry). */
export function getComponentDependencies(
  platform: "web" | "native",
  nativeBlur: NativeBlurMode = "expo-blur",
): string[] {
  const base = ["class-variance-authority", "clsx", "tailwind-merge"]
  if (platform === "web") return base
  return nativeBlur === "expo-blur" ? [...base, "nativewind", "expo-blur"] : [...base, "nativewind"]
}

export function getInstallCommand(
  profile: ProjectProfile,
  platform: "web" | "native",
  nativeBlur: NativeBlurMode = "expo-blur",
): string {
  const pm = profile.packageManager
  const run = pm === "npm" ? "npm install" : pm === "pnpm" ? "pnpm add" : "yarn add"
  // expo-blur must match the Expo SDK, so it goes through `expo install` instead of the package manager.
  const deps = getComponentDependencies(platform, nativeBlur).filter((d) => d !== "expo-blur")
  const baseCmd = `${run} ${deps.join(" ")}`
  return platform === "native" && nativeBlur === "expo-blur" ? `npx expo install expo-blur\n${baseCmd}` : baseCmd
}
