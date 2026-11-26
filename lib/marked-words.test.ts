import { describe, expect, it } from "vitest"
import { parseMarkedWords } from "./marked-words"

const keys = (s: string) => parseMarkedWords(s).filter((w) => w.key).map((w) => w.text)

describe("parseMarkedWords", () => {
  it("keeps every word and strips the markers", () => {
    expect(parseMarkedWords("One *glass system*. Done").map((w) => w.text)).toEqual(["One", "glass", "system.", "Done"])
  })

  it("flags single and multi-word marked spans, punctuation included", () => {
    expect(keys("Seven primitives. One *glass system*. *Web and native*, from a *single source*.")).toEqual([
      "glass",
      "system.",
      "Web",
      "and",
      "native,",
      "single",
      "source.",
    ])
    expect(keys("Un *vidrio* real")).toEqual(["vidrio"])
  })

  it("leaves unmarked sentences untouched", () => {
    expect(keys("No markers here")).toEqual([])
  })
})
