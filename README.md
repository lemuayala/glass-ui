# Glass UI — Glassmorphism Generator

A premium playground to design and export **Glassmorphism** components for
**React Native + NativeWind** (and Tailwind on the web). Built with Next.js,
TypeScript, Tailwind CSS, and `class-variance-authority`.

## Features

- **Live preview** rendered with the same Tailwind utilities the exported code
  produces — so what you see is exactly what you'll ship.
- **Two export modes**:
  - `Inline` — a single `<View className="...">` snippet ready to paste.
  - `Reusable` — a fully-typed `GlassCard` component using CVA + tailwind-merge.
- **Granular controls**: theme, blur, intensity, radius, border, padding, shadow.
- **Wallpaper picker** — five iOS-grade backgrounds to stress-test the glass.
- **NativeWind-compatible** — every utility is supported on RN.

## Stack

- Next.js (App Router) · TypeScript
- Tailwind CSS v4
- `class-variance-authority` + `tailwind-merge` for the reusable component
- `prism-react-renderer` for code highlighting
- Lucide icons

## Project structure

```
.
├── app/
│   ├── layout.tsx           # iOS-premium dark layout
│   ├── page.tsx             # Mounts the generator
│   └── globals.css          # Tokens + glass utilities
├── components/
│   └── glass/
│       ├── generator.tsx    # Top-level orchestrator (controls + preview + code)
│       ├── header.tsx
│       ├── controls.tsx     # iOS-style segmented controls
│       ├── preview.tsx      # Live GlassCard preview
│       ├── code-panel.tsx   # Syntax highlighted code with copy / download
│       ├── wallpaper.tsx    # Wallpaper component + picker
│       ├── segmented.tsx    # Reusable segmented control
│       └── app-background.tsx
└── lib/
    └── glass-core/          # Future home of @glass-ui/core
        ├── types.ts
        ├── variants.ts      # Single source of truth (CVA)
        ├── codegen.ts       # generateCode({ component, mode, options })
        └── templates/
            ├── glass-card-inline.ts
            └── glass-card-reusable.ts
```

`lib/glass-core` is intentionally framework-agnostic. It will be promoted to a
standalone package under `@glass-ui/core` once the second component lands.

## Adding a new component

1. Add the kind to `ComponentKind` in `lib/glass-core/types.ts`.
2. Define its CVA variants in `lib/glass-core/variants.ts` (or a new file).
3. Create `templates/<name>-inline.ts` and `templates/<name>-reusable.ts`.
4. Add a case to `generateCode()` in `lib/glass-core/codegen.ts`.
5. Wire it into the header pills in `components/glass/header.tsx`.

## Local development

```bash
pnpm install
pnpm dev
```

Then open the URL printed by Next.js.

## License

MIT.
