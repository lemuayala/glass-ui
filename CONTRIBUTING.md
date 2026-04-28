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
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Technical Guidelines

- **Components**: New components should follow the existing structure:
    - Add to `ComponentKind` in `lib/glass-core/types.ts`.
    - Add CVA variants in `lib/glass-core/variants.ts`.
    - Create 4 templates: Web (Inline/Reusable) and Native (Inline/Reusable).
- **Styling**: Use Tailwind CSS v4. Avoid arbitrary values; stick to the design system.
- **i18n**: Every new UI string must be added to `lib/i18n/dictionaries.ts` for both **English** and **Spanish**.
- **Types**: Use TypeScript strictly. Use `forwardRef` for reusable components.

## Development Setup

```bash
npm install
npm run dev
```

## Community

- **Discussions**: Use GitHub Discussions for questions and ideas.
- **Code of Conduct**: Be respectful and inclusive.

Happy coding!
