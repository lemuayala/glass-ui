# GLASS.md specification

Glass UI generates **GLASS.md** files for AI coding agents (Cursor, Claude Code, etc.).

## Sections

1. **Meta** — component, platform, export mode, stack, path, optional share URL
2. **Design specification** — table of 8 glass props
3. **Glass rules** — backdrop-blur, intensity, borders, component-specific notes
4. **Generated code** — output of `generateCode()`
5. **Usage** — output of `generateUsageSnippet()`
6. **Project integration** — install command, file tree, steps
7. **Acceptance criteria** — checklist for the agent
8. **Do not** — anti-patterns

## Runtime API

```ts
import { generateGlassPrompt, generateShortGlassPrompt } from "@/lib/glass-core/integration-prompt"

generateGlassPrompt({ codegen, profile, shareUrl?, presetName? })
generateShortGlassPrompt({ codegen, profile })
```

## Profile

Stored in `localStorage` key `glass-ui-profile-v1`. Not included in share URLs.
