<div align="center">

  <br/>
  <h1>Glass UI</h1>
  <p><b>Glassmorphism playground for web and React Native.</b></p>
  <br/>

  <p>
    Tune seven iOS-style primitives, preview on iPhone or iPad,<br/>
    export Tailwind / NativeWind TSX, and copy <b>GLASS.md</b> for your editor or agent.
  </p>

  <br/>

  [![Live Demo](https://img.shields.io/badge/Live%20Demo-glass--ui--play.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://glass-ui-play.vercel.app)
  [![Playground](https://img.shields.io/badge/Open-Playground-111827?style=for-the-badge)](https://glass-ui-play.vercel.app/play)
  [![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org)
  [![React](https://img.shields.io/badge/React-19-149eca?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
  [![License](https://img.shields.io/badge/License-MIT-black?style=for-the-badge)](LICENSE)
  [![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-black?style=for-the-badge)](CONTRIBUTING.md)

  <br/>
  
  <img width="2028" height="1314" alt="Captura desde 2026-05-24 18-57-51" src="https://github.com/user-attachments/assets/9961b309-57ee-4c6c-a15b-5ca08ed42c4a" />

  <img width="2028" height="1314" alt="Captura desde 2026-05-24 18-58-09" src="https://github.com/user-attachments/assets/8b628ee5-f3de-4f13-a9de-8f5f7fccd894" />

  <br/>
  <br/>
</div>

<hr/>

## What you get

- **Playground** (`/play`) — Card, Button, Input, Modal, Tab Bar, Switch, Nav Bar; blur, tint, radius, intensity, borders, padding, shadow.
- **Device preview** — iPhone, iPad, or full-width; upload a wallpaper to check transparency.
- **Presets** — Frosted, Liquid Glass, Smoked, Crystal, Sunset, Aqua.
- **Export** — web inline or CVA component; native (`expo-blur` `<BlurView>` or NativeWind) inline or typed file; **GLASS.md** with tokens, TSX, paths, and a short checklist.
- **CLI & npm** — install components via `npx @lemuayala/glass-ui-core add card` or import `@lemuayala/glass-ui-core` directly.
- **shadcn registry** — every primitive, preset and platform as a shadcn item: `npx shadcn@latest add https://glass-ui-play.vercel.app/r/glass-card.json` (index at `/r/registry.json`, everything at `/r/glass-ui.json`).
- **MCP Server** — connect `@lemuayala/glass-ui-mcp` to Claude Code, Cursor, or Antigravity (`claude mcp add glass-ui -- npx -y @lemuayala/glass-ui-mcp`).
- **Share URL** — same design opens for anyone with the link.
- **EN / ES** — UI translated; component names stay in English in the nav.

## CLI & MCP Quick Setup

```bash
# Drop a typed component directly into your Next.js, Vite, or Expo project
npx @lemuayala/glass-ui-core add card
npx @lemuayala/glass-ui-core add button --native --preset liquid --glass-md

# Or with the shadcn CLI (items: <component>[-<preset>][-native])
npx shadcn@latest add https://glass-ui-play.vercel.app/r/glass-card.json
npx shadcn@latest add https://glass-ui-play.vercel.app/r/glass-button-liquid.json

# Connect Glass UI MCP server to Claude Code
claude mcp add glass-ui -- npx -y @lemuayala/glass-ui-mcp
```

<br/>

## Components

<div align="center">

| Primitive | Web | React Native |
| :--- | :---: | :---: |
| **Card** | ✅ | ✅ |
| **Button** | ✅ | ✅ |
| **Input** | ✅ | ✅ |
| **Modal** | ✅ | ✅ |
| **Tab Bar** | ✅ | ✅ |
| **Switch** | ✅ | ✅ |
| **Nav Bar** | ✅ | ✅ |

</div>

<br/>

### Core properties

| Property | Options |
| :--- | :--- |
| `theme` | `light` · `dark` |
| `blur` | `none` · `sm` · `md` · `lg` · `xl` |
| `rounded` | `none` · `md` · `lg` · `xl` · `2xl` · `3xl` · `full` |
| `intensity` | `subtle` · `medium` · `strong` |
| `border` | `none` · `subtle` · `strong` |
| `padding` | `sm` · `md` · `lg` |
| `shadow` | `none` · `sm` · `md` · `lg` |
| `tint` | `none` · `blue` · `pink` · `orange` · `teal` |

<br/>

## GLASS.md

Open the code panel in the playground and copy **GLASS.md**. It includes your current props, target project (framework, paths, Tailwind version, package manager), generated TSX, usage snippet, and integration steps — useful for Cursor, Claude, or Copilot without re-describing the design.

<br/>

## Export modes

| Mode | Web | Native |
| :--- | :--- | :--- |
| Inline snippet | Tailwind classes in JSX | `expo-blur` `<BlurView>` or NativeWind on `View` / `Pressable` |
| Reusable component | CVA + `forwardRef` | Typed CVA component + `<BlurView>` / NativeWind |

<br/>

## Quick start

Requires **pnpm**.

```bash
git clone https://github.com/lemuayala/glass-ui.git
cd glass-ui
pnpm install
pnpm dev
```

| URL | Route |
| :--- | :--- |
| [localhost:3000](http://localhost:3000) | Landing |
| [localhost:3000/play](http://localhost:3000/play) | Playground |

Optional (see `.env.example`):

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_GITHUB_URL=https://github.com/lemuayala/glass-ui
```

```bash
pnpm icons:export   # regenerate apple-icon PNGs from SVG
```

<br/>

## Scripts

| Command | Purpose |
| :--- | :--- |
| `pnpm dev` | Dev server |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript check |
| `pnpm test` | Unit & integration tests (Vitest) |
| `pnpm test:coverage` | Tests with V8 coverage thresholds |
| `pnpm test:e2e` | Browser E2E suite (Playwright, desktop + mobile) |

<br/>

## Tech stack

| Layer | Technology |
| :--- | :--- |
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| UI | [React 19](https://react.dev) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Variants | [CVA](https://cva.style) |
| Native | NativeWind-oriented templates |
| Theming | [next-themes](https://github.com/pacocoursey/next-themes) |
| Highlighting | [prism-react-renderer](https://github.com/FormidableLabs/prism-react-renderer) |
| i18n | Custom dictionaries (`lib/i18n/`) |

Codegen: `lib/glass-core/` · Contributor notes: [AGENTS.md](AGENTS.md)

<br/>

## Keyboard shortcuts

| Shortcut | Action |
| :--- | :--- |
| `1`–`7` | Switch component |
| `T` | Component theme |
| `P` | Presets |
| `S` | Copy share link |
| `L` | Language |
| `Shift+T` | App theme |
| `?` | Shortcuts |
| `Esc` | Close dialogs |

<br/>

## Roadmap

- [x] Switch & Nav Bar
- [x] GLASS.md + project profile
- [x] Landing + `/play`, share URLs
- [x] Real native blur (`expo-blur` `<BlurView>`) + NativeWind switch
- [x] `@lemuayala/glass-ui-core` npm package + CLI installer
- [x] `@lemuayala/glass-ui-mcp` server for coding agents
- [x] Post-publish smoke test against npm
- [x] shadcn-compatible registry (`/r/*.json`)
- [ ] Figma plugin
- [ ] Embedded native preview (Expo Snack)

<br/>

## Deploy

Hosted on **[Vercel](https://vercel.com)** — preview on pull requests, production on `main`.

<br/>

<div align="center">

  <p>Built with ❤️ by <a href="https://github.com/lemuayala">lemuayala</a></p>

  <a href="https://github.com/lemuayala/glass-ui">⭐ Star on GitHub</a> ·
  <a href="https://glass-ui-play.vercel.app/play">▶ Open playground</a> ·
  <a href="https://github.com/lemuayala/glass-ui/issues">Report an issue</a>

  <br/><br/>

  <sub>MIT License</sub>

</div>
