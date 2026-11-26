export type MarkedWord = { text: string; key: boolean }

/**
 * Splits a sentence into words, flagging the ones wrapped in `*asterisks*` as key words
 * (a marked span may cover several words: "One *glass system*." → glass, system).
 * Translations decide which words to highlight, so each language keeps its own emphasis.
 */
export function parseMarkedWords(sentence: string): MarkedWord[] {
  let inKey = false
  return sentence
    .split(/\s+/)
    .filter(Boolean)
    .map((raw) => {
      const opens = raw.startsWith("*")
      const closes = /\*[^\w]*$/.test(raw) && (raw.length > 1 || !opens)
      const key = inKey || opens
      if (opens) inKey = true
      if (closes) inKey = false
      return { text: raw.replace(/\*/g, ""), key }
    })
}
