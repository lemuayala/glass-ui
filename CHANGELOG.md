# Changelog

All notable changes to Glass UI — the site, `@lemuayala/glass-ui-core` and `@lemuayala/glass-ui-mcp` — are
documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project
uses [Semantic Versioning](https://semver.org/). Every version bump needs an entry: CI checks it, and the
release workflow publishes the section as the GitHub Release notes.

## [Unreleased]

### Added

- Landing: Apple-style scroll scenes. A pinned "glass zoom" (a full-screen window pulls back and its card turns
  into frosted glass with a live blur readout and token chips), a statement whose words light up as you scroll,
  and a hero that recedes. Built on a new `ScrollScene` primitive (scroll progress as `--p`, CSS does the motion).

### Changed

- Landing counters come from `@lemuayala/glass-ui-core` (primitives, presets, code variants, registry items).
- Agent cards enter Apple-style: rise, grow from 96% and come into focus.

## [0.6.1] - 2026-11-25

### Fixed

- `GlassInput` failed strict type-checking (TS2320): its `size` variant clashed with the native `<input size>`
  attribute. Affected the CLI, the MCP server and the shadcn registry, which share the template.
- The `GlassSwitch` usage example referenced an undeclared `setOn`; it is now a complete component.
- Console errors on the landing (GitHub 403 rate limit, npm downloads 404): stars and npm stats now come from a
  server-cached `/api/stats` instead of the browser calling GitHub and npm.

### Changed

- New minimalist logo (a color orb behind a frosted pane) for the app icon, favicon and social preview image.

### Added

- Test that fully type-checks every generated web component and usage snippet against React, cva, clsx and
  tailwind-merge.

## [0.6.0] - 2026-11-25

### Added

- shadcn-compatible registry at `/r/registry.json` and `/r/<item>.json`, generated from
  `@lemuayala/glass-ui-core`: every primitive × preset × platform, plus `glass-ui` for all web primitives.
  `npx shadcn@latest add https://glass-ui-play.vercel.app/r/glass-card.json`
- Core API: `buildRegistry`, `getRegistryItem`, `shadcnAddCommand`, `getComponentDependencies`.
- MCP: `generate_component` returns `registry.shadcnCommand` when the result matches a registry item.
- Landing: "Using shadcn/ui?" card in the AI agents section.
- Release: post-publish smoke test that installs both packages from npm (`pnpm smoke:published`).

## [0.5.2] - 2026-11-25

### Added

- MCP server sends agent instructions on connect and exposes the `glass_component` prompt.
- Landing: "For AI agents" section (Claude Code, Cursor / Windsurf / Antigravity, CLI), npm pill in the
  header, install command and npm links in the hero and final CTA.

### Fixed

- Animated landing titles stayed in English after switching to Spanish.
- MCP Registry description over the 100-character limit; registry publish now retries independently of npm.

## [0.5.1] - 2026-11-25

### Changed

- Packages published under the `@lemuayala` npm scope: `@lemuayala/glass-ui-core`, `@lemuayala/glass-ui-mcp`.

## [0.5.0] - 2026-11-25

### Added

- `@lemuayala/glass-ui-core` workspace package with the zero-config CLI installer
  (`npx @lemuayala/glass-ui-core add card`).
- `@lemuayala/glass-ui-mcp` Model Context Protocol server.
- Real native blur with `expo-blur` `<BlurView>` alongside pure NativeWind classes.
- Release workflow: npm Trusted Publishing (OIDC) and MCP Registry entry when code lands on `main`.

## [0.4.1] - 2026-11-25

### Added

- Automated quality suite: TSX compilation checks, coverage, RTL integration and Playwright E2E in CI.

### Fixed

- JSX escaping in generated code, URL state validation and strict TypeScript in the Next build.

## [0.4.0] - 2026-05-24

### Added

- GLASS.md integration prompts (full and quick) and target project profile.
- Landing at `/`, playground at `/play`, shareable URLs.
- `GlassSwitch` and `GlassNavigationBar` (7 primitives), EN / ES.

[Unreleased]: https://github.com/lemuayala/glass-ui/compare/v0.6.1...HEAD
[0.6.1]: https://github.com/lemuayala/glass-ui/releases/tag/v0.6.1
[0.6.0]: https://github.com/lemuayala/glass-ui/releases/tag/v0.6.0
[0.5.2]: https://github.com/lemuayala/glass-ui/releases/tag/v0.5.2
[0.5.1]: https://github.com/lemuayala/glass-ui/releases/tag/v0.5.1
[0.5.0]: https://github.com/lemuayala/glass-ui/releases/tag/v0.5.0
[0.4.1]: https://github.com/lemuayala/glass-ui/releases/tag/v0.4.1
[0.4.0]: https://github.com/lemuayala/glass-ui/releases/tag/v0.4.0
