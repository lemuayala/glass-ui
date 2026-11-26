"use client"

import { useEffect, useRef } from "react"
import { stagger, utils } from "animejs"
import { Bot, Terminal, Workflow } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { NPM_PACKAGES } from "@/lib/config"
import { useT } from "@/lib/i18n/provider"
import {
  createEnterScene,
  prefersReducedMotion,
  revealVisible,
  setRevealPending,
} from "@/lib/landing-motion"
import { CopyButton } from "./copy-button"

const MCP_SERVER_KEY = "glass-ui"

const CLAUDE_COMMAND = `claude mcp add ${MCP_SERVER_KEY} -- npx -y ${NPM_PACKAGES.mcp}`

const EDITOR_CONFIG = JSON.stringify(
  { mcpServers: { [MCP_SERVER_KEY]: { command: "npx", args: ["-y", NPM_PACKAGES.mcp] } } },
  null,
  2,
)

const CLI_COMMAND = `npx ${NPM_PACKAGES.core} add card`

type AgentCard = { Icon: LucideIcon; title: string; hint: string; snippet: string }

export function LandingAgents() {
  const t = useT()
  const sectionRef = useRef<HTMLElement | null>(null)
  const headRef = useRef<HTMLDivElement | null>(null)
  const cardsRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    const head = headRef.current
    const cardsEl = cardsRef.current
    if (!section || !head || !cardsEl) return
    const cards = cardsEl.querySelectorAll<HTMLElement>("[data-agent-card]")

    if (prefersReducedMotion()) {
      revealVisible([head, cards])
      return
    }

    setRevealPending([head], 20)
    utils.set(cards, { opacity: 0, translateY: 24 })

    const scene = createEnterScene(section, {
      anchor: () => headRef.current,
      lockTargets: () => [head, cards],
    })
    scene
      .add(head, { opacity: [0, 1], translateY: [18, 0], duration: 480 }, 0)
      .add(cards, { opacity: [0, 1], translateY: [24, 0], delay: stagger(70), duration: 520 }, 120)
    scene.armReveal()

    return () => {
      scene.revert?.()
    }
  }, [t])

  const cards: AgentCard[] = [
    { Icon: Bot, title: t("landing.agents.claude"), hint: t("landing.agents.claudeHint"), snippet: CLAUDE_COMMAND },
    { Icon: Workflow, title: t("landing.agents.editors"), hint: t("landing.agents.editorsHint"), snippet: EDITOR_CONFIG },
    { Icon: Terminal, title: t("landing.agents.cli"), hint: t("landing.agents.cliHint"), snippet: CLI_COMMAND },
  ]

  return (
    <section
      id="agents"
      ref={sectionRef}
      className="relative mx-auto mt-32 w-full max-w-6xl scroll-mt-24 px-6 md:mt-48"
    >
      <div ref={headRef} className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {t("landing.agents.eyebrow")}
        </span>
        <h2 className="mt-5 text-balance text-3xl font-bold leading-[1.05] tracking-[-0.02em] text-foreground sm:text-4xl md:text-5xl">
          {t("landing.agents.title")}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          {t("landing.agents.desc")}
        </p>
      </div>

      <div ref={cardsRef} className="mt-14 grid gap-5 md:grid-cols-3">
        {cards.map(({ Icon, title, hint, snippet }) => (
          <div
            key={title}
            data-agent-card
            className="gg-glass gg-glass-inset flex min-w-0 flex-col rounded-3xl p-6"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-foreground/15 to-foreground/[0.04] shadow-[inset_0_1px_0_0_var(--gg-glass-inset-light)]">
                <Icon className="h-4 w-4 text-foreground" strokeWidth={2.2} />
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold tracking-tight text-foreground">{title}</h3>
                <p className="text-xs text-muted-foreground">{hint}</p>
              </div>
            </div>
            <div className="mt-5 flex flex-1 flex-col gap-2 rounded-2xl border border-border bg-background/50 p-3">
              <div className="flex justify-end">
                <CopyButton text={snippet} copyLabel={t("landing.agents.copy")} copiedLabel={t("landing.agents.copied")} />
              </div>
              <pre className="whitespace-pre-wrap [overflow-wrap:anywhere] font-mono text-[11px] leading-relaxed text-foreground/90">
                <code>{snippet}</code>
              </pre>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
