# Mobile performance contract

Landing targets viewports **≤767px**; playground layout uses Tailwind `lg` (1024px) in components.

## Rules

| Rule | Mobile | Desktop |
|------|--------|---------|
| `backdrop-blur` on sticky/fixed chrome | Solid `bg-background/90`, no blur | Allowed |
| `blur-3xl` / animated fixed orbs | Disabled | Allowed |
| Canvas / continuous RAF | Not mounted | Hero particles OK |
| Scroll-driven `filter` animation | Avoid | OK with care |
| Section enter reveal | Same IO + scroll gate as desktop (`createEnterScene`) | Same |

## Flags

- `html.gg-landing-lite` — set from `useLandingLiteDocument()` on `LandingPage`.
- `useLandingLite()` — `useIsMobile()` OR `prefers-reduced-motion` (e.g. Siri CTA).

## Validation (manual)

1. iPhone: landing scroll 30s without stutter; no constant CPU from RAF.
2. Scroll-to-top does not hitch scroll.
3. `#primitives` enter animation plays when the mockup is in view.
4. `/play`: preview uses most of the viewport; no overlapping primitives.
5. iOS Reduce Motion: full page usable, static.
6. Desktop `md+` / `lg+`: rich motion unchanged.

Run: `pnpm build`, `pnpm lint`, `pnpm test`.
