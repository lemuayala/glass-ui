<div align="center">

  <br/>
  <h1>Glass UI</h1>
  <p><b>iOS-style glass components for React and React Native, ready for you and your AI.</b></p>
  <br/>

  <p>
    Tune seven glass primitives in a live playground, then take them into your project<br/>
    with the CLI, the shadcn registry, an MCP server for your coding agent, or a GLASS.md file.
  </p>

  <br/>

  [![Live Demo](https://img.shields.io/badge/Live%20Demo-glass--ui--play.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://glass-ui-play.vercel.app)
  [![Playground](https://img.shields.io/badge/Open-Playground-111827?style=for-the-badge)](https://glass-ui-play.vercel.app/play)
  [![npm core](https://img.shields.io/npm/v/@lemuayala/glass-ui-core?style=for-the-badge&logo=npm&label=glass-ui-core&color=cb3837)](https://www.npmjs.com/package/@lemuayala/glass-ui-core)
  [![npm mcp](https://img.shields.io/npm/v/@lemuayala/glass-ui-mcp?style=for-the-badge&logo=npm&label=glass-ui-mcp&color=cb3837)](https://www.npmjs.com/package/@lemuayala/glass-ui-mcp)
  <br/>
  [![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org)
  [![React](https://img.shields.io/badge/React-19-149eca?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
  [![Expo](https://img.shields.io/badge/Expo-NativeWind-000020?style=for-the-badge&logo=expo&logoColor=white)](https://docs.expo.dev)
  [![License](https://img.shields.io/badge/License-MIT-black?style=for-the-badge)](LICENSE)
  [![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-black?style=for-the-badge)](CONTRIBUTING.md)

  <br/>

  <img width="2028" height="1314" alt="Glass UI playground with a glass card over a wallpaper" src="https://github.com/user-attachments/assets/9961b309-57ee-4c6c-a15b-5ca08ed42c4a" />

  <img width="2028" height="1314" alt="Glass UI code panel with the exported TSX and GLASS.md" src="https://github.com/user-attachments/assets/8b628ee5-f3de-4f13-a9de-8f5f7fccd894" />

  <br/>
  <br/>

  [Why](#why-glass-ui) · [Get started](#get-started) · [AI agents](#use-it-with-your-ai-agent) · [Components](#components) · [How it works](#how-it-works) · [What's new](#whats-new) · [Roadmap](#roadmap) · [Contributing](#contributing)

</div>

<hr/>

## Why Glass UI

Glass effects look simple and are annoying to get right. The blur, the tint, the border that catches the light and
the opacity all have to agree with each other, and they look different on a white page, on a photo and on a phone.
On React Native it's a different API altogether. Most of us end up tweaking values by eye in every project.

Glass UI is one set of glass tokens and seven components (Card, Button, Input, Modal, Tab Bar, Switch and Nav Bar)
that look the same on the web and in Expo. You tune them once in the playground, with a real wallpaper behind them,
and you get typed TSX you can keep. Or you skip the playground and ask your coding agent for "a frosted login card":
the MCP server gives it the same components, presets and code.

It's free, MIT licensed, and everything is generated from a single package, so the playground, the CLI, the shadcn
registry and the MCP server never drift apart.

## Get started

Pick whichever fits how you work. They all produce the same code.

| I want to… | Do this |
| :--- | :--- |
| See it and play with it | Open the [playground](https://glass-ui-play.vercel.app/play) |
| Add a component to my project | `npx @lemuayala/glass-ui-core add card` |
| Use it with shadcn/ui | `npx shadcn@latest add https://glass-ui-play.vercel.app/r/glass-card.json` |
| Have my AI agent build with it | `claude mcp add glass-ui -- npx -y @lemuayala/glass-ui-mcp` |
| Paste a spec into any editor or chat | Copy **GLASS.md** from the playground's code panel |

### CLI

The CLI writes a typed component file into your project (Next.js, Vite or Expo). No config needed.

```bash
npx @lemuayala/glass-ui-core add card
npx @lemuayala/glass-ui-core add button --preset liquid
npx @lemuayala/glass-ui-core add modal --native --glass-md   # React Native + a GLASS.md next to it
```

Other flags: `--nativewind` (plain NativeWind classes instead of `expo-blur`), `--inline`, `--dir <path>`, `--force`.

### shadcn registry

Every primitive, preset and platform is a registry item named `<component>[-<preset>][-native]`.

```bash
npx shadcn@latest add https://glass-ui-play.vercel.app/r/glass-card.json
npx shadcn@latest add https://glass-ui-play.vercel.app/r/glass-button-liquid.json
npx shadcn@latest add https://glass-ui-play.vercel.app/r/glass-ui.json        # all web primitives
```

The full index lives at [`/r/registry.json`](https://glass-ui-play.vercel.app/r/registry.json).

## Use it with your AI agent

`@lemuayala/glass-ui-mcp` is a [Model Context Protocol](https://modelcontextprotocol.io) server. Once it's connected,
your agent knows the Glass UI components and builds them the way the playground does, instead of guessing at
`backdrop-blur` values. It's also listed in the official MCP Registry.

**Claude Code**

```bash
claude mcp add glass-ui -- npx -y @lemuayala/glass-ui-mcp
```

**Cursor, Windsurf, Antigravity** (add to your `mcp.json`)

```json
{
  "mcpServers": {
    "glass-ui": { "command": "npx", "args": ["-y", "@lemuayala/glass-ui-mcp"] }
  }
}
```

Then just ask: *"Make me a frosted login card"* or *"Add a liquid glass tab bar to the Expo app"*.

What the server gives your agent:

| | What it does |
| :--- | :--- |
| `list_primitives` | The seven components, their options and defaults |
| `list_presets` | Frosted, Liquid Glass, Smoked, Crystal, Sunset and Aqua, with their exact values |
| `generate_component` | The TSX for web or React Native, a usage example and the install command (plus the shadcn command when there's a matching item) |
| `generate_glass_md` | A GLASS.md spec for the component |
| `glass_component` prompt | A ready-made prompt to build a component step by step |

On connect it also sends instructions, so the agent follows the same rules the project uses.

## Components

| Primitive | Web | React Native |
| :--- | :---: | :---: |
| **Card** | ✅ | ✅ |
| **Button** | ✅ | ✅ |
| **Input** | ✅ | ✅ |
| **Modal** | ✅ | ✅ |
| **Tab Bar** | ✅ | ✅ |
| **Switch** | ✅ | ✅ |
| **Nav Bar** | ✅ | ✅ |

Every component takes the same glass options:

| Option | Values |
| :--- | :--- |
| `theme` | `light` · `dark` |
| `blur` | `none` · `sm` · `md` · `lg` · `xl` |
| `rounded` | `none` · `md` · `lg` · `xl` · `2xl` · `3xl` · `full` |
| `intensity` | `subtle` · `medium` · `strong` |
| `border` | `none` · `subtle` · `strong` |
| `padding` | `sm` · `md` · `lg` |
| `shadow` | `none` · `sm` · `md` · `lg` |
| `tint` | `none` · `blue` · `pink` · `orange` · `teal` |

You can export each one two ways:

| Mode | Web | React Native |
| :--- | :--- | :--- |
| Inline snippet | Tailwind classes in JSX | `expo-blur` `<BlurView>` or NativeWind on `View` / `Pressable` |
| Reusable component | CVA variants + `forwardRef` | Typed CVA component with `<BlurView>` or NativeWind |

### GLASS.md

GLASS.md is a single file that describes the component you designed: the tokens, the generated TSX, a usage
example, where to put the files in your project (framework, paths, Tailwind version, package manager) and a short
checklist. Paste it into Cursor, Claude or Copilot and they have everything they need, without you re-explaining
the design.

## How it works

Everything comes from one package, `@lemuayala/glass-ui-core`. It holds the variants, presets and code templates,
and every other piece is generated from it:

```text
packages/core  (variants, presets, TSX templates, GLASS.md builder)
   ├── CLI            npx @lemuayala/glass-ui-core add …
   ├── shadcn registry /r/*.json, built from the same templates
   ├── packages/mcp   @lemuayala/glass-ui-mcp, the server your agent talks to
   └── this site      the landing and the /play playground
```

So when a component changes in the core, the playground, the CLI, the registry and the MCP server all change with
it. Tests type-check every generated component against React, CVA, clsx and tailwind-merge, and after each release
CI installs both packages from npm to make sure they work as published.

## What's new

Every release is written up in [CHANGELOG.md](CHANGELOG.md) and on the [Releases](https://github.com/lemuayala/glass-ui/releases) page. The highlights so far:

- **0.6**: shadcn-compatible registry, the MCP server suggests the shadcn command, and a smoke test against npm after every release.
- **0.5**: the npm packages (`glass-ui-core` with the CLI, and `glass-ui-mcp`), real native blur with `expo-blur`, and the full test suite in CI.
- **0.4**: GLASS.md, the project profile, the landing page, share links, and the Switch and Nav Bar components.

## Roadmap

Done:

- [x] Seven primitives on web and React Native, six presets
- [x] GLASS.md and the target project profile
- [x] npm package with a zero-config CLI
- [x] MCP server for coding agents, listed in the MCP Registry
- [x] shadcn-compatible registry

Next:

- [ ] Live native preview in the playground with Expo Snack
- [ ] Figma plugin, so designers can use the same tokens
- [ ] More presets and primitives (ideas welcome)

Have an idea or need something that isn't here? [Open an issue](https://github.com/lemuayala/glass-ui/issues/new/choose) and tell us what you're building.

## Run it locally

You need Node 20.9 or newer (CI runs on 22) and **pnpm**.

```bash
git clone https://github.com/lemuayala/glass-ui.git
cd glass-ui
pnpm install
pnpm dev
```

The landing is at [localhost:3000](http://localhost:3000) and the playground at [localhost:3000/play](http://localhost:3000/play).
`.env.example` lists the optional settings (`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GITHUB_URL`).

| Command | What it does |
| :--- | :--- |
| `pnpm dev` | Dev server |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript check |
| `pnpm test` | Unit and integration tests (Vitest) |
| `pnpm test:coverage` | Tests with coverage thresholds |
| `pnpm test:e2e` | Browser tests, desktop and mobile (Playwright) |
| `pnpm icons:export` | Regenerate the app icons from the SVGs |

<details>
<summary><b>Playground keyboard shortcuts</b></summary>

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

</details>

## Tech stack

| Layer | Technology |
| :--- | :--- |
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| UI | [React 19](https://react.dev) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Variants | [CVA](https://cva.style) |
| Native output | [Expo](https://docs.expo.dev) `expo-blur` and [NativeWind](https://www.nativewind.dev) |
| Agents | [Model Context Protocol](https://modelcontextprotocol.io) SDK |
| Tests | [Vitest](https://vitest.dev), Testing Library, [Playwright](https://playwright.dev) |
| Hosting | [Vercel](https://vercel.com): previews on pull requests, production on `main` |

## Contributing

Contributions of any size are welcome: bug reports, a new preset, translations, docs fixes, tests or a whole new
primitive. [CONTRIBUTING.md](CONTRIBUTING.md) explains the workflow, and [AGENTS.md](AGENTS.md) lists the steps for
adding a component. Please read the [Code of Conduct](CODE_OF_CONDUCT.md), and report security issues privately as
described in [SECURITY.md](SECURITY.md).

<br/>

<div align="center">

  <p>Built with ❤️ by <a href="https://github.com/lemuayala">lemuayala</a></p>

  <a href="https://github.com/lemuayala/glass-ui">⭐ Star on GitHub</a> ·
  <a href="https://glass-ui-play.vercel.app/play">▶ Open the playground</a> ·
  <a href="https://github.com/lemuayala/glass-ui/issues">Report an issue</a>

  <br/><br/>

  <sub>MIT License</sub>

</div>
