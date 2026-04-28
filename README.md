<div align="center">
  
  <br/>
  <h1>✨ Glass UI</h1>
  <p><b>The definitive glassmorphism component generator.</b></p>
  <br/>

  <p>
    Design stunning, iOS-inspired interfaces in seconds.<br/>
    Export flawlessly to <b>React Web</b> and <b>React Native</b>.
  </p>

  <br/>

  [![Live Demo](https://img.shields.io/badge/Live%20Demo-v0--glass--ui--flax.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://v0-glass-ui-flax.vercel.app)
  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org)
  [![License](https://img.shields.io/badge/License-MIT-black?style=for-the-badge)](LICENSE)
  [![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-black?style=for-the-badge)](CONTRIBUTING.md)

  <br/>
  
  <!-- Add your real screenshot here -->
  <img src="docs/screenshot.png" alt="Glass UI Interface" width="800" style="border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);"/>

  <br/>
  <br/>
</div>

<hr/>

## 💎 Crafted for Perfection

Glass UI isn't just a code generator—it's a premium design playground. We've reverse-engineered the subtle blur, intensity, and lighting of iOS and macOS interfaces to bring true glassmorphism to your projects. 

No dependencies on bulky UI libraries. No complex configuration. Just pure, drop-in components powered by Tailwind CSS and NativeWind.

<br/>

## 🚀 Pro Features

- 🎨 **Real-time Canvas:** Watch your designs respond instantly as you tune blur, tint, and lighting.
- 📱 **Device Environments:** Preview your UI inside a beautifully modeled iPhone or iPad emulator.
- ✂️ **Universal Export:** Copy the exact component code for **Web** (Tailwind) or **Mobile** (React Native).
- 🎛️ **Intelligent Codegen:** Get both the full component logic and the ready-to-use `<JSX />` snippet.
- 🌍 **Bilingual & Accessible:** Fully translated into English and Spanish.
- ⌨️ **Keyboard Native:** Built for power users with complete keyboard shortcuts.

<br/>

## 🧩 The Components

We ship five meticulously designed primitives. Each adapts perfectly to light and dark themes and exposes the exact same **8 core properties**.

<div align="center">

| Primitives | Web (React + HTML) | Mobile (React Native) |
| :--- | :---: | :---: |
| **Glass Card** | ✅ | ✅ |
| **Glass Button** | ✅ | ✅ |
| **Glass Input** | ✅ | ✅ |
| **Glass Modal** | ✅ | ✅ |
| **Glass Tab Bar** | ✅ | ✅ |

</div>

<br/>

### Core Properties

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

<br/>

## 💻 Engine Architecture

Glass UI generates four distinct output modes tailored to your specific framework needs:

### 1. Web Snippet
Clean, inline HTML with Tailwind classes. Best for rapid prototyping.

### 2. Web Component (CVA)
A robust `forwardRef` React component built with `class-variance-authority`. Drop it straight into your design system.

### 3. Native Snippet
A React Native `<View>` powered by `NativeWind`.

### 4. Native Component
A fully-typed, prop-driven React Native primitive that handles complex `compoundVariants` for flawless mobile rendering.

### Code Generation Flow

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

<br/>

## 🛠️ Tech Stack

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

<br/>

## ⌨️ Keyboard Shortcuts

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

<br/>

## ⚡️ Quick Start

Want to run the playground locally? It's as simple as:

```bash
# Clone the repository
git clone https://github.com/lemuayala/glass-ui.git

# Enter the directory
cd glass-ui

# Install dependencies and start the engine
npm install
npm run dev
```

Visit `http://localhost:3000` to start designing.

<br/>

## 🗺️ Roadmap

- [ ] `GlassSwitch` component
- [ ] `GlassNavigationBar` component
- [ ] Export as NPM package (`@glass-ui/core`)
- [ ] Figma plugin integration
- [ ] Live preview for Native components (Expo Snack embed)
- [ ] More preset styles

<br/>

## 🤝 Community & Contributions

We believe premium tools should be accessible to everyone. Glass UI is 100% open-source and MIT licensed. 

Want to add a new component? Have a gorgeous wallpaper to share? Check out our [Contributing Guidelines](CONTRIBUTING.md) to get started.

<br/>

<div align="center">
  <p>Designed with care for the developer community.</p>
  <a href="https://github.com/lemuayala/glass-ui">⭐ Star on GitHub</a> • <a href="https://github.com/lemuayala/glass-ui/issues">🐛 Report a Bug</a> • <a href="https://github.com/lemuayala/glass-ui/discussions">💬 Discuss</a>
</div>
