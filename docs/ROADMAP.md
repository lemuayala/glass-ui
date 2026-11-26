# Glass UI Roadmap

## Shipped (v0.6)

- shadcn-compatible registry served at `/r/registry.json` and `/r/<item>.json`, generated from `@lemuayala/glass-ui-core`
- MCP `generate_component` returns the matching shadcn install command
- Post-publish smoke test in the release workflow (`pnpm smoke:published`)

## Shipped (v0.5)

- `@lemuayala/glass-ui-core` npm package + zero-config CLI installer (`npx @lemuayala/glass-ui-core add ...`)
- `@lemuayala/glass-ui-mcp` Model Context Protocol server (`npx -y @lemuayala/glass-ui-mcp`)
- Real native hardware blur via `expo-blur` (`<BlurView>`) alongside pure NativeWind classes
- Full automated quality suite (TSX AST compiler checks, V8 coverage, RTL integration, Playwright E2E, GitHub Actions CI)

## Shipped (v0.4)

- GLASS.md integration prompts (full + quick)
- Target project profile in playground
- Landing `/` + playground `/play`
- `GlassSwitch` and `GlassNavigationBar` (7 primitives)

## Next

- [ ] Figma plugin
- [ ] Expo Snack live native preview
- [ ] More presets & primitives
