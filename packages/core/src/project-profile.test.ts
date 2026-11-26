import { describe, expect, it } from "vitest"
import { MAX_COMPONENT_PATH_LENGTH, isSafeComponentPath } from "./project-profile.js"

describe("isSafeComponentPath", () => {
  it.each(["components/ui", "src/components/ui", "components/ui/", "@/components/ui", "~/ui", "app/_ui/glass-v2", "."])(
    "accepts %s",
    (path) => expect(isSafeComponentPath(path)).toBe(true),
  )

  it.each([
    ["empty", ""],
    ["absolute", "/etc"],
    ["parent", "../outside"],
    ["nested parent", "components/../../outside"],
    ["quote (import injection)", 'ui"; import x from "evil'],
    ["newline", "ui\nimport x"],
    ["backtick", "ui`"],
    ["space", "my components"],
    ["windows drive", "C:\Users"],
    ["too long", "a".repeat(MAX_COMPONENT_PATH_LENGTH + 1)],
  ])("rejects %s", (_label, path) => expect(isSafeComponentPath(path)).toBe(false))
})
