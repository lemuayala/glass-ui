<div align="center">

<h1>🪟 Glass UI</h1>

<p>
  <strong>Premium Glassmorphism component generator for React (Web) and React Native (NativeWind)</strong><br>
  Design once. Export anywhere.
</p>

[![Live Demo](https://img.shields.io/badge/Live%20Demo-glass--ui.vercel.app-6366f1?style=for-the-badge&logo=vercel&logoColor=white)](https://glass-ui.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge)](CONTRIBUTING.md)

<br/>

<!-- Replace with actual screenshot -->
![Glass UI Playground Screenshot](docs/screenshot.png)

</div>

---

## What is Glass UI?

Glass UI is a free, open-source **interactive playground** that lets you design glassmorphism components in real time and instantly export production-ready code for:

- ✅ **React (Web)** — Standard HTML elements + Tailwind CSS
- ✅ **React Native** — NativeWind-compatible components with full TypeScript types

No dependencies on UI libraries. No config. Just copy and paste.

---

## Features

| Feature | Description |
|---|---|
| 🎨 **Live Preview** | See your component update in real time as you tweak properties |
| 📱 **Device Frames** | Preview inside an iPhone, iPad, or full-screen canvas |
| 🌈 **Wallpapers** | 8 curated backgrounds (aurora, sunset, forest, etc.) + custom image upload |
| ✂️ **Code Export** | Web and Native, Inline and Reusable — 4 export modes per component |
| 🔗 **Shareable URLs** | Every configuration is encoded in the URL — share your exact design |
| 🌍 **i18n** | English and Spanish built in |
| ⌨️ **Keyboard Shortcuts** | Navigate components, toggle themes, and share with keyboard only |
| 🎛️ **Presets** | Curated styles: Frosted, Liquid Glass, Smoked, Crystal, Sunset, Aqua |

---

## Components

| Component | Web | Native |
|---|---|---|
| `GlassCard` | ✅ | ✅ |
| `GlassButton` | ✅ | ✅ |
| `GlassInput` | ✅ | ✅ |
| `GlassModal` | ✅ | ✅ |
| `GlassTabBar` | ✅ | ✅ |

Each component exposes the same **8 properties**:

| Property | Options |
|---|---|
| `theme` | `light` · `dark` |
| `blur` | `none` · `sm` · `md` · `lg` · `xl` |
| `rounded` | `none` · `md` · `lg` · `xl` · `2xl` · `3xl` · `full` |
| `intensity` | `subtle` · `medium` · `strong` |
| `border` | `none` · `subtle` · `strong` |
| `padding` | `sm` · `md` · `lg` |
| `shadow` | `none` · `sm` · `md` · `lg` |
| `tint` | `none` · `blue` · `pink` · `orange` · `teal` |

---

## Export Modes

Glass UI generates 4 types of output for every component:

### Web · Inline
A quick, self-contained snippet using plain HTML + Tailwind classes. Perfect for one-off usage directly in a page.

```tsx
// 👇 Paste this anywhere in your React component.
export function Example() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/20 p-6 shadow-md backdrop-blur-md">
      <h3 className="text-base font-semibold text-neutral-900">Now Playing</h3>
    </div>
  )
}
```

### Web · Reusable
A fully-typed, production-ready React component using [CVA](https://cva.style) + `tailwind-merge`. Drop into `components/ui/glass-card.tsx`.

```tsx
import { GlassCard } from "./components/ui/glass-card"

<GlassCard theme="light" blur="md" rounded="2xl" tint="teal" padding="md">
  <h3>Now Playing</h3>
</GlassCard>
```

### Native · Inline
A [NativeWind](https://nativewind.dev)-compatible snippet using React Native primitives (`View`, `Text`, `Pressable`, etc.).

```tsx
import { View, Text } from "react-native"

<View className="overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur-lg">
  <Text className="text-base font-semibold text-white">Now Playing</Text>
</View>
```

### Native · Reusable
A fully-typed, forwardRef-compatible React Native component with CVA variants. Includes all `compoundVariants` for theme × intensity × tint.

```tsx
import { GlassCard } from "./components/ui/glass-card"
import { Text } from "react-native"

<GlassCard theme="dark" blur="lg" rounded="3xl" tint="teal">
  <Text className="text-base font-semibold text-white">Now Playing</Text>
</GlassCard>
```

> **Tip:** In Reusable mode, the "Copy" button exports the full component file. The "Usage" button copies just the call-site with your current props — ready to paste into any screen that already imports the component.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Syntax Highlighting | [prism-react-renderer](https://github.com/FormidableLabs/prism-react-renderer) |
| Component Variants | [class-variance-authority](https://cva.style) |
| Toasts | [Sonner](https://sonner.emilkowal.ski) |
| Tooltips | [Radix UI](https://radix-ui.com/primitives/docs/components/tooltip) |
| Theming | [next-themes](https://github.com/pacocoursey/next-themes) |
| i18n | Custom zero-dependency dictionary system |
| Analytics | [Vercel Analytics](https://vercel.com/analytics) (production only) |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm / pnpm / yarn

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/lemuayala/glass-ui.git
cd glass-ui

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables (optional)

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_GITHUB_URL` | Your fork's GitHub URL (for the Star button) | `https://github.com/lemuayala/glass-ui` |

---

## Project Structure

```
glass-ui/
├── app/                         # Next.js App Router
│   ├── page.tsx                 # Root page
│   └── layout.tsx               # HTML shell, fonts, metadata
├── components/
│   ├── glass/                   # All playground UI
│   │   ├── generator.tsx        # Root layout + state orchestration
│   │   ├── preview.tsx          # Live device preview + wallpaper
│   │   ├── controls.tsx         # Properties panel
│   │   ├── code-panel.tsx       # Code viewer + copy buttons
│   │   ├── header.tsx           # Navigation + actions
│   │   ├── presets-menu.tsx     # Curated style presets
│   │   ├── wallpaper.tsx        # Wallpaper picker
│   │   ├── ios-icons.tsx        # SF Symbol-style SVG icons
│   │   └── segmented.tsx        # Segmented control component
│   └── ui/
│       └── tooltip.tsx          # Radix Tooltip (glassmorphic styled)
├── lib/
│   ├── glass-core/
│   │   ├── types.ts             # Shared TypeScript types
│   │   ├── variants.ts          # CVA variants + class getters
│   │   ├── codegen.ts           # Code generation entry point
│   │   ├── presets.ts           # Preset definitions
│   │   └── templates/
│   │       ├── _shared.ts       # Shared CVA snippets (tint variants)
│   │       ├── glass-card-inline.ts
│   │       ├── glass-card-reusable.ts
│   │       ├── glass-button-inline.ts
│   │       ├── glass-button-reusable.ts
│   │       ├── glass-input-inline.ts
│   │       ├── glass-input-reusable.ts
│   │       ├── glass-modal-inline.ts
│   │       ├── glass-modal-reusable.ts
│   │       ├── glass-tabbar-inline.ts
│   │       ├── glass-tabbar-reusable.ts
│   │       └── native/
│   │           ├── glass-card.ts        # Native Card (inline + reusable)
│   │           └── others.ts            # Native Button/Input/Modal/TabBar
│   └── i18n/
│       ├── dictionaries.ts      # EN + ES translation strings
│       └── provider.tsx         # i18n React context
└── public/                      # Static assets, favicons, wallpapers
```

### Adding a New Component

1. Add the type to `ComponentKind` in `lib/glass-core/types.ts`
2. Add CVA variants and class getter in `lib/glass-core/variants.ts`
3. Create 4 template files (web-inline, web-reusable, native-inline, native-reusable)
4. Register all 4 in `lib/glass-core/codegen.ts`
5. Add a `ComponentStage` renderer in `components/glass/preview.tsx`
6. Add the nav label key to `lib/i18n/dictionaries.ts`

---

## Code Generation Architecture

```
generateCode(CodegenInput)
    │
    ├── platform === "web"
    │       ├── mode === "inline"    → renderGlass[X]Inline(options)
    │       └── mode === "reusable" → renderGlass[X]Reusable(options)
    │
    └── platform === "native"
            ├── mode === "inline"    → renderGlass[X]NativeInline(options)
            └── mode === "reusable" → renderGlass[X]NativeReusable(options)

generateUsageSnippet(CodegenInput)
    └── Produces a concise call-site with the user's current props as explicit attributes
```

The `defaultVariants` in every reusable template are populated at generation time with the user's **current selections**, so the exported component is pre-configured out of the box.

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `1–5` | Switch component (Card, Button, Input, Modal, TabBar) |
| `T` | Toggle component theme (light/dark) |
| `P` | Open presets |
| `S` | Copy share link |
| `L` | Toggle language (EN/ES) |
| `Shift+T` | Toggle app theme |
| `?` | Show shortcuts |
| `Esc` | Close dialogs |

---

## Contributing

Contributions of all kinds are welcome — bug fixes, new components, wallpapers, translations, and documentation improvements!

### Workflow

```bash
# 1. Fork the repo and clone your fork
git clone https://github.com/<your-username>/glass-ui.git
cd glass-ui

# 2. Create a feature branch
git checkout -b feat/your-feature-name

# 3. Make your changes and commit
git add .
git commit -m "feat: add GlassSwitch component"

# 4. Push to your fork
git push origin feat/your-feature-name

# 5. Open a Pull Request against main
```

### Guidelines

- Follow the existing file naming conventions
- Match the TypeScript style (typed props, forwardRef for reusable components)
- Add translations for new UI strings in **both** `en` and `es` in `lib/i18n/dictionaries.ts`
- Keep templates self-contained — no runtime imports from the playground
- Test your component in both **web** and **native** export modes

### Ideas for Contributions

- 🆕 New components: `GlassSwitch`, `GlassSlider`, `GlassNotification`, `GlassNavigationBar`
- 🌍 New languages
- 🖼️ New wallpapers
- 🎨 New presets
- 🐛 Bug fixes

---

## Roadmap

- [ ] `GlassSwitch` component
- [ ] `GlassNavigationBar` component
- [ ] Export as NPM package (`@glass-ui/core`)
- [ ] Figma plugin integration
- [ ] Live preview for Native components (Expo Snack embed)
- [ ] More preset styles

---

## License

MIT © [Lemuel Ayala](https://github.com/lemuayala)

---

<div align="center">
  <p>Built with ❤️ for the React and React Native community.</p>
  <p>
    <a href="https://github.com/lemuayala/glass-ui">⭐ Star on GitHub</a> ·
    <a href="https://github.com/lemuayala/glass-ui/issues">🐛 Report a Bug</a> ·
    <a href="https://github.com/lemuayala/glass-ui/discussions">💬 Discuss</a>
  </p>
</div>
