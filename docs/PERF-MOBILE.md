# Mobile performance contract

Landing and playground targets for viewports **≤767px** (landing) and **≤1023px** (playground layout).

## Rules

| Rule | Mobile | Desktop |
|------|--------|---------|
| `backdrop-blur` on sticky/fixed chrome | Solid `bg-background/90`, no blur | Allowed |
| `blur-3xl` / animated fixed orbs | Disabled | Allowed |
| Canvas / continuous RAF | Not mounted | Hero particles OK |
| Scroll-driven `filter` animation | Avoid | OK with care |
| `window.scroll` per section | Lite: one IO gate per section | Desktop: one IO gate per section (`isSectionRevealReady`) |

## Flags

- `html.gg-landing-lite` — set from `LandingPage` when `useLandingLite()` is true.
- `useLandingLite()` — `useIsMobile()` OR `prefers-reduced-motion`.

## Validation (manual)

1. iPhone: landing scroll 30s without stutter; no constant CPU from RAF.
2. Scroll-to-top does not hitch scroll.
3. `#primitives` loads fast on mobile (static variant).
4. `/play`: preview uses most of the viewport; no overlapping primitives.
5. iOS Reduce Motion: full page usable, static.
6. Desktop `md+` / `lg+`: rich motion unchanged.

Run: `pnpm build`, `pnpm lint`, `pnpm test`.
