"use client"

import { useEffect, useRef } from "react"
import { splitText, stagger, utils } from "animejs"
import { FileCode2 } from "lucide-react"
import { useT } from "@/lib/i18n/provider"
import { GlassMdLine } from "./glass-md-render"
import { createEnterScene, prefersReducedMotion, revealVisible, setRevealPending } from "@/lib/landing-motion"
import { isLandingLiteViewport } from "@/lib/mobile-landing"

const SAMPLE = `# GLASS.md — GlassCard

## 1. Meta
| Component | GlassCard |
| Platform  | React Web |
| Mode      | Reusable  |
| Tailwind  | v4        |

## 2. Design specification
| theme     | dark   |
| blur      | xl     |
| rounded   | 2xl    |
| intensity | medium |

## 3. Generated code
\`\`\`tsx
export const GlassCard = forwardRef(
  ({ theme, blur, ...props }, ref) => (
    <div className={cn(glassCard({ theme, blur }))} {...props} />
  ),
)
\`\`\`

## 4. Acceptance criteria
- [ ] Builds without TypeScript errors
- [ ] Uses backdrop-blur on a non-flat background
- [ ] Reuses existing cn() helper
`

export function LandingCode() {
  const t = useT()
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const codeRef = useRef<HTMLPreElement | null>(null)
  const titleRef = useRef<HTMLHeadingElement | null>(null)
  const subRef = useRef<HTMLParagraphElement | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    const code = codeRef.current
    const title = titleRef.current
    const sub = subRef.current
    if (!section || !code || !title || !sub) return

    const lines = code.querySelectorAll<HTMLElement>("[data-line]")
    const lite = isLandingLiteViewport()

    if (prefersReducedMotion()) {
      revealVisible([title, sub, lines])
      return
    }

    if (lite) {
      setRevealPending([title, sub], 18)
      utils.set(lines, { opacity: 0, translateX: -8 })

      const scene = createEnterScene(section, {
        anchor: () => titleRef.current,
        lockTargets: () => [title, sub, lines],
      })
      scene
        .add(title, { opacity: [0, 1], translateY: [18, 0], duration: 420 }, 0)
        .add(sub, { opacity: [0, 1], translateY: [12, 0], duration: 380 }, 100)
        .add(
          lines,
          {
            opacity: [0, 1],
            translateX: [-8, 0],
            delay: stagger(18, { start: 0 }),
            duration: 280,
          },
          200,
        )
      scene.armReveal()
      return () => scene.revert?.()
    }

    const titleSplit = splitText(title, { words: { wrap: "clip" } })

    setRevealPending(titleSplit.words, 26)
    setRevealPending(sub, 20)
    utils.set(lines, { opacity: 0, translateX: -10 })

    const scene = createEnterScene(section, {
      anchor: () => titleRef.current,
      lockTargets: () => [titleSplit.words, sub, lines],
    })
    scene
      .add(
        titleSplit.words,
        {
          opacity: [0, 1],
          translateY: [22, 0],
          delay: stagger(50),
          duration: 600,
        },
        0,
      )
      .add(
        sub,
        {
          opacity: [0, 1],
          translateY: [16, 0],
          duration: 500,
        },
        160,
      )
      .add(
        lines,
        {
          opacity: [0, 1],
          translateX: [-10, 0],
          delay: stagger(24, { start: 0 }),
          duration: 320,
        },
        280,
      )

    scene.armReveal()

    return () => {
      scene.revert?.()
      titleSplit.revert?.()
    }
  }, [t])

  return (
    <section
      id="code"
      ref={sectionRef}
      className="relative mx-auto mt-32 w-full max-w-6xl scroll-mt-24 px-6 md:mt-48"
    >
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
        {/* Left — copy */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <FileCode2 className="h-3 w-3" />
            GLASS.md
          </span>
          <h2
            ref={titleRef}
            className="mt-5 max-w-md text-balance text-3xl font-bold leading-[1.05] tracking-[-0.02em] text-foreground sm:text-4xl md:text-5xl"
          >
            {t("landing.code.title")}
          </h2>
          <p
            ref={subRef}
            className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground"
          >
            {t("landing.code.desc")}
          </p>
          <ul className="mt-7 space-y-2.5 text-sm text-muted-foreground">
            {[t("landing.code.b1"), t("landing.code.b2"), t("landing.code.b3")].map((b) => (
              <li key={b} className="flex items-start gap-2.5">
                <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-primary to-pink-400" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right — code panel */}
        <div className="relative">
          {/* Faint glow behind */}
          <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[2.5rem] bg-[radial-gradient(circle_at_center,_oklch(0.7_0.18_250_/_0.22),_transparent_70%)] blur-2xl" />

          <div className="gg-glass gg-glass-inset overflow-hidden rounded-2xl">
            {/* macOS-style window bar */}
            <div className="flex items-center justify-between border-b border-white/[0.08] bg-foreground/[0.03] px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                GLASS-card.md
              </span>
              <span className="text-[10px] text-muted-foreground/50">·</span>
            </div>
            <pre
              ref={codeRef}
              className="gg-glass-prompt gg-scroll max-h-[440px] overflow-auto overscroll-contain px-3 py-4 font-mono text-[11px] leading-[1.65] sm:px-5 sm:py-5 sm:text-[12px] sm:leading-[1.7]"
            >
              {SAMPLE.split("\n").map((line, i) => (
                <GlassMdLine key={i} line={line} />
              ))}
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}
