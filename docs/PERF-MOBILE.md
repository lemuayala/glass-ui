# Mobile performance contract

Landing targets viewports **≤767px**; playground layout uses Tailwind `lg` (1024px) in components.

## Motion architecture (landing)

Same pattern as the Iron Fit landing — no animation library on the landing:

| Piece | What it does | Cost |
|-------|--------------|------|
| `<Reveal>` / `<RevealWords>` (`components/glass/reveal.tsx`) | One shared IntersectionObserver sets `data-shown` once; CSS transitions do the entrance | Compositor only, no rAF |
| `<ScrollScene>` (`components/glass/scroll-scene.tsx`) | Scroll progress as `--p`, CSS maps it to transforms | One shared listener + one rAF for all scenes; reads before writes; off-screen scenes skipped |
| `<CountUp>` | Counts when visible; server renders the final value | Short rAF burst, then idle |
| Hero entrance | CSS keyframes (`.gg-hero-in`) on load | No JS |

Content is **visible by default**: hidden states only apply while JS can reveal them (`@media (scripting: none)` and
reduced motion show everything), elements already scrolled past are shown immediately, and counters are never stuck at 0.

anime.js remains a dependency for the **playground** (`components/glass/preview.tsx`) only.

## Rules

| Rule | Mobile | Desktop |
|------|--------|---------|
| `backdrop-blur` on sticky/fixed chrome | Solid `bg-background/90`, no blur | Allowed |
| `blur-3xl` decorative orbs | Hidden (`hidden md:block`) | Allowed |
| Canvas / continuous rAF | Not started (`LandingParticles` bails) | Particles run only while the hero is on screen |
| `filter` in entrances | None (`html.gg-landing-lite`) | blur(8px) → 0 |
| `backdrop-filter` on a layer that moves | Never — zoom card uses a translucent fill until the window settles | Allowed |
| `will-change` on landing glass panels | `auto` (`.gg-landing .gg-glass`) | `auto` |
| Scroll-driven scenes | Shorter runways (`gg-landing-lite`), 4:5 zoom window | Full |

## Flags

- `html.gg-landing-lite` — set from `useLandingLiteDocument()` on `LandingPage`.
- `useLandingLite()` — `useIsMobile()` OR `prefers-reduced-motion` (e.g. Siri CTA).
- `.gg-landing` — landing root; scopes landing-only overrides so the playground is untouched.

## Validation (manual)

1. iPhone: landing scroll 30s without stutter; no constant CPU from rAF after the hero.
2. Fast fling to the bottom and back: no section left blank, counters show real numbers.
3. Anchor links (`#agents`) land on visible content.
4. `/play`: unchanged (playground keeps its own anime.js preview).
5. iOS Reduce Motion: full page usable, static, scenes unpinned.
6. Desktop `md+` / `lg+`: zoom, statement and reveals play.

Run: `pnpm build`, `pnpm lint`, `pnpm test`.
