# @lemuayala/glass-ui-core

Core primitives, CVA variants, presets, TSX code generator (Web Tailwind + React Native `expo-blur` / NativeWind), `GLASS.md` prompt builder, and CLI component installer for [Glass UI](https://glass-ui-play.vercel.app).

## CLI Installer (zero-config)

Drop typed Glass UI components directly into any Next.js, Vite, or Expo project:

```bash
# Web (Tailwind + CVA)
npx @lemuayala/glass-ui-core add card
npx @lemuayala/glass-ui-core add all --preset liquid --dir src/components/ui

# React Native (Expo BlurView + NativeWind)
npx @lemuayala/glass-ui-core add button --native --preset frosted --glass-md
```

## shadcn Registry

The same components are published as a [shadcn](https://ui.shadcn.com/docs/registry) registry. Item names are `<component>[-<preset>][-native]`; `glass-ui` installs every web primitive.

```bash
npx shadcn@latest add https://glass-ui-play.vercel.app/r/glass-card.json
npx shadcn@latest add https://glass-ui-play.vercel.app/r/glass-tabbar-liquid-native.json
npx shadcn@latest add https://glass-ui-play.vercel.app/r/glass-ui.json
```

`buildRegistry()`, `getRegistryItem()` and `shadcnAddCommand()` build the same JSON programmatically.

## Programmatic API

```ts
import {
  PRESETS,
  generateCode,
  generateGlassPrompt,
  getGlassCardClasses,
  DEFAULT_PROJECT_PROFILE,
} from "@lemuayala/glass-ui-core"

const classes = getGlassCardClasses(PRESETS[0].options)

const tsx = generateCode({
  component: "glass-card",
  mode: "reusable",
  platform: "native",
  nativeBlur: "expo-blur",
  options: PRESETS[1].options,
})

const glassMd = generateGlassPrompt({
  codegen: {
    component: "glass-card",
    mode: "reusable",
    platform: "native",
    nativeBlur: "expo-blur",
    options: PRESETS[1].options,
  },
  profile: { ...DEFAULT_PROJECT_PROFILE, framework: "expo" },
})
```

## License

MIT
