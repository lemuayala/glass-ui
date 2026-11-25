# Contributing to Glass UI

First off, thank you for considering contributing to Glass UI! It's people like you that make the open-source community such an amazing place to learn, inspire, and create.

## How Can I Contribute?

### Reporting Bugs
- Check the [Issues](https://github.com/lemuayala/glass-ui/issues) to see if the bug has already been reported.
- If not, open a new issue. Include a clear title, a description of the problem, steps to reproduce, and any relevant screenshots.

### Suggesting Enhancements
- Feature requests are welcome! Open an issue and describe the feature you'd like to see, why it's useful, and how it should work.

### Pull Requests
1. Fork the repo and create your branch from `dev`.
2. If you've added code that should be tested, add tests (`pnpm test`).
3. If you've changed APIs, update the documentation.
4. Ensure TypeScript, ESLint, and production build pass (`pnpm lint && pnpm build`).
5. Issue that pull request against `dev`!

## Technical Guidelines

- **Components**: New components should follow the existing structure (see [AGENTS.md](AGENTS.md)):
    - Add to `ComponentKind` in `lib/glass-core/types.ts`.
    - Add CVA variants + `getGlass*Classes` in `lib/glass-core/variants.ts`.
    - Create 4 templates: Web (Inline/Reusable) and Native (Inline/Reusable).
    - Register in `lib/glass-core/codegen.ts`, preview stage, controls, header nav, and URL state.
- **Styling**: Use Tailwind CSS v4. Avoid arbitrary values; stick to the design system (`app/globals.css`).
- **i18n**: Every new UI string must be added to `lib/i18n/dictionaries.ts` for both **English** and **Spanish**.
- **Types**: Use TypeScript strictly. Use `forwardRef` for reusable components.

## Development Setup

Requires **pnpm** (enforced via `preinstall`).

```bash
pnpm install
pnpm dev
```

## Community

- **Discussions**: Use GitHub Discussions for questions and ideas.
- **Code of Conduct**: Be respectful and inclusive.

Happy coding!
