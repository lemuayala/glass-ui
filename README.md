# Glass UI

Playground to tune iOS-style glassmorphism and copy the result into your app.  
Seven primitives, live preview on web and native, four export shapes, plus **GLASS.md** for pasting into Cursor, Claude, or Copilot.

**[Open playground →](https://glass-ui.vercel.app/play)** · [Landing](https://glass-ui.vercel.app)

<img width="1530" height="1249" alt="Glass UI playground" src="https://github.com/user-attachments/assets/310fa706-0369-4a65-a2a3-162e9bbb1958" />

## What you get

- **Playground** (`/play`) — pick Card, Button, Input, Modal, Tab Bar, Switch, or Nav Bar; adjust blur, tint, radius, intensity, borders, padding, and shadow.
- **Device preview** — iPhone, iPad, or full-width; optional wallpaper upload to check transparency.
- **Presets** — Frosted, Liquid Glass, Smoked, Crystal, Sunset, Aqua (starting points, not locked styles).
- **Export**
  - Web: inline Tailwind snippet or reusable CVA component
  - Native: NativeWind inline or typed component file
  - **GLASS.md** — tokens, generated TSX, suggested paths, and a short checklist for your stack (Next, Vite, Expo, etc.)
- **Shareable URL** — encodes component + props so someone else sees the same design.
- **EN / ES** — UI strings; component names stay in English in the nav (Card, Button, …).

No runtime npm package yet: you copy code into your repo. Styling lives in your Tailwind / NativeWind setup (`gg-glass` utilities in `app/globals.css`).

## Components

| Primitive | Web | React Native |
|-----------|:---:|:------------:|
| Card | ✓ | ✓ |
| Button | ✓ | ✓ |
| Input | ✓ | ✓ |
| Modal | ✓ | ✓ |
| Tab Bar | ✓ | ✓ |
| Switch | ✓ | ✓ |
| Nav Bar | ✓ | ✓ |

Shared controls: `theme`, `blur`, `rounded`, `intensity`, `border`, `padding`, `shadow`, `tint` (see playground panel).

## GLASS.md

In the playground, open the code panel and copy **GLASS.md**. It reflects:

- Your current props and preset
- Target project (framework, component path, Tailwind version, package manager, shadcn flag)
- Generated TSX + usage snippet
- Steps to drop files in the right place

Handy when you want an editor or agent to integrate without re-explaining the design.

## Run locally

Requires **pnpm** (enforced in `preinstall`).

```bash
git clone https://github.com/lemuayala/glass-ui.git
cd glass-ui
pnpm install
pnpm dev
```

- Landing: http://localhost:3000  
- Playground: http://localhost:3000/play  

Optional env (see `.env.example`):

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_GITHUB_URL=https://github.com/lemuayala/glass-ui
```

Regenerate PNG icons from SVG:

```bash
pnpm icons:export
```

## Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Dev server |
| `pnpm build` | Production build |
| `pnpm test` | Vitest (`lib/glass-core/integration-prompt.test.ts`) |
| `pnpm lint` | ESLint |
| `pnpm icons:export` | Build `apple-icon*.png` from `public/app-icon*.svg` |

## Stack

Next.js 16 (App Router), React 19, Tailwind CSS v4, CVA, NativeWind-oriented native templates, `next-themes`, small custom i18n dictionaries.

Codegen lives under `lib/glass-core/` (variants + templates). Agent guidelines for contributors: `AGENTS.md`.

## Keyboard shortcuts (playground)

| Key | Action |
|-----|--------|
| `1`–`7` | Switch component |
| `T` | Component light/dark |
| `P` | Presets |
| `S` | Copy share link |
| `L` | Language |
| `Shift+T` | App theme |
| `?` | Shortcuts help |
| `Esc` | Close dialogs |

## Roadmap

- [x] Switch & Nav Bar
- [x] GLASS.md + project profile
- [x] Landing + `/play` split, share URLs
- [ ] Publish `@glass-ui/core` (tokens + components)
- [ ] Figma plugin
- [ ] Embedded native preview (Expo Snack)

## Deploy

Production builds are deployed on **Vercel** from this repo (preview on PRs, production on `main`). You do not need GitHub Actions for hosting.

## License

MIT — see [LICENSE](LICENSE).

---

Built by [@lemuayala](https://github.com/lemuayala). Issues and PRs welcome.
