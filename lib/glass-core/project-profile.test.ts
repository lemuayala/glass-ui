import { beforeEach, describe, expect, it } from "vitest"
import {
  DEFAULT_PROJECT_PROFILE,
  STORAGE_KEY_PROFILE,
  frameworkLabel,
  getFileStructure,
  getInstallCommand,
  readProjectProfile,
  writeProjectProfile,
} from "./project-profile"

describe("project-profile helpers", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it("builds install commands per package manager and platform", () => {
    expect(getInstallCommand({ ...DEFAULT_PROJECT_PROFILE, packageManager: "npm" }, "web")).toBe(
      "npm install class-variance-authority clsx tailwind-merge",
    )
    expect(getInstallCommand({ ...DEFAULT_PROJECT_PROFILE, packageManager: "pnpm" }, "native")).toBe(
      "pnpm add class-variance-authority clsx tailwind-merge nativewind",
    )
    expect(getInstallCommand({ ...DEFAULT_PROJECT_PROFILE, packageManager: "yarn" }, "web")).toBe(
      "yarn add class-variance-authority clsx tailwind-merge",
    )
  })

  it("formats suggested file structures across all frameworks", () => {
    expect(getFileStructure({ ...DEFAULT_PROJECT_PROFILE, framework: "next-app-router" }, "glass-card")).toContain(
      "app/\n  globals.css",
    )
    expect(getFileStructure({ ...DEFAULT_PROJECT_PROFILE, framework: "vite-react" }, "glass-card")).toContain(
      "src/\n  components/ui/\n    glass-card.tsx",
    )
    expect(getFileStructure({ ...DEFAULT_PROJECT_PROFILE, framework: "expo" }, "glass-card")).toContain(
      "app/\n  _layout.tsx",
    )
    expect(getFileStructure({ ...DEFAULT_PROJECT_PROFILE, framework: "other" }, "glass-card")).toContain(
      "components/ui/\n  glass-card.tsx",
    )
    expect(frameworkLabel("expo")).toBe("Expo (React Native)")
  })

  it("persists and recovers gracefully from corrupted localStorage", () => {
    expect(readProjectProfile()).toEqual(DEFAULT_PROJECT_PROFILE)

    writeProjectProfile({ ...DEFAULT_PROJECT_PROFILE, framework: "expo", packageManager: "pnpm" })
    expect(readProjectProfile().framework).toBe("expo")
    expect(readProjectProfile().packageManager).toBe("pnpm")

    window.localStorage.setItem(STORAGE_KEY_PROFILE, "{not-valid-json")
    expect(readProjectProfile()).toEqual(DEFAULT_PROJECT_PROFILE)
  })
})
