# @glass-ui/core

Core primitives, CVA variants, presets, TSX code generator (Web Tailwind + React Native `expo-blur` / NativeWind), `GLASS.md` prompt builder, and CLI component installer for [Glass UI](https://glass-ui-play.vercel.app).

## CLI Installer (zero-config)

Drop typed Glass UI components directly into any Next.js, Vite, or Expo project:

```bash
# Web (Tailwind + CVA)
npx @glass-ui/core add card
npx @glass-ui/core add all --preset liquid --dir src/components/ui

# React Native (Expo BlurView + NativeWind)
npx @glass-ui/core add button --native --preset frosted --glass-md
```

## Programmatic API

```ts
import {
  PRESETS,
  generateCode,
  generateGlassPrompt,
  getGlassCardClasses,
  DEFAULT_PROJECT_PROFILE,
} from "@glass-ui/core"

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
