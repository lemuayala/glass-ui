# Glass UI — Agent guidelines

## Stack

- Next.js App Router, React 19, Tailwind CSS v4
- Glass tokens in `app/globals.css` (`--gg-glass-*`, `.gg-glass`, `.gg-glass-inset`)
- Workspace packages:
  - `packages/core/` (`@glass-ui/core` — CVA variants, presets, TSX templates, `GLASS.md` builder, CLI installer; re-exported in `lib/glass-core/`)
  - `packages/mcp/` (`@glass-ui/mcp` — stdio MCP server exposing primitives, presets, and codegen tools)

## Adding a component

1. Add to `ComponentKind` in `packages/core/src/types.ts`
2. Add CVA + `getGlass*Classes` in `packages/core/src/variants.ts`
3. Create 4 templates in `packages/core/src/templates/`: web inline/reusable, native inline/reusable (`expo-blur` + `nativewind`)
4. Register in `packages/core/src/codegen.ts`, `presets.ts`, `cli-runner.ts`, and `packages/mcp/src/server.ts`
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

## App icon & SEO assets

- Master SVG: `public/app-icon.svg` (dark), `public/app-icon-light.svg` (light)
- UI + favicon: `public/apple-icon.png`, `public/apple-icon-light.png` (theme-aware via `BrandLogo`)
- Social preview: `public/og-image.png` (1200×630)
- SEO: `lib/seo.ts`, `app/sitemap.ts`, `app/robots.ts`, JSON-LD in layout
- Re-export: `pnpm icons:export`
