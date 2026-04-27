/**
 * Shared snippets injected into reusable templates so we keep one source
 * of truth for things like tint variants & compounds.
 *
 * These are *strings* (code) that get interpolated into the generated
 * component file. They are NOT used at runtime by the playground itself —
 * the playground uses the typed versions in `../variants.ts`.
 */

export const TINT_VARIANT_SNIPPET = `tint: {
        none: "",
        blue: "",
        pink: "",
        orange: "",
        teal: "",
      }`

export const TINT_COMPOUNDS_SNIPPET = `      { tint: "blue", intensity: "subtle", className: "bg-blue-500/15" },
      { tint: "blue", intensity: "medium", className: "bg-blue-500/25" },
      { tint: "blue", intensity: "strong", className: "bg-blue-500/40" },
      { tint: "pink", intensity: "subtle", className: "bg-pink-500/15" },
      { tint: "pink", intensity: "medium", className: "bg-pink-500/25" },
      { tint: "pink", intensity: "strong", className: "bg-pink-500/40" },
      { tint: "orange", intensity: "subtle", className: "bg-orange-500/20" },
      { tint: "orange", intensity: "medium", className: "bg-orange-500/30" },
      { tint: "orange", intensity: "strong", className: "bg-orange-500/45" },
      { tint: "teal", intensity: "subtle", className: "bg-teal-500/15" },
      { tint: "teal", intensity: "medium", className: "bg-teal-500/25" },
      { tint: "teal", intensity: "strong", className: "bg-teal-500/40" },`
