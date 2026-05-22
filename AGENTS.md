# Glass UI — Agent guidelines

## Stack

- Next.js App Router, React 19, Tailwind CSS v4
- Glass tokens in `app/globals.css` (`--gg-glass-*`, `.gg-glass`, `.gg-glass-inset`)
- Codegen in `lib/glass-core/` (CVA + templates)

## Adding a component

1. Add to `ComponentKind` in `lib/glass-core/types.ts`
2. Add CVA + `getGlass*Classes` in `lib/glass-core/variants.ts`
3. Create 4 templates: web inline/reusable, native inline/reusable
4. Register in `lib/glass-core/codegen.ts` and `generateUsageSnippet`
5. Preview stage in `components/glass/preview.tsx`
6. Defaults in `components/glass/controls.tsx`, nav in `header.tsx`, URL keys in `use-url-state.ts`
7. i18n keys in `lib/i18n/dictionaries.ts` (EN + ES)
8. Keyboard shortcut index if applicable

## UI conventions

- Panels use `gg-glass gg-glass-inset rounded-2xl`
- Labels: `text-xs font-semibold uppercase tracking-wider text-muted-foreground`
- Do not introduce a second design system; extend existing glass patterns

## GLASS.md prompts

- Generator: `lib/glass-core/integration-prompt.ts`
- Spec: `docs/GLASS-PROMPT-SPEC.md`
