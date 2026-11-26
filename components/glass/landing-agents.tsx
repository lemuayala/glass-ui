"use client"

import { ArrowUpRight, Bot, Braces, Check, Layers, Sparkles, Terminal, Workflow } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { NPM_PACKAGES, npmPackageUrl } from "@/lib/config"
import type { NpmPackageName } from "@/lib/config"
import { GLASS_UI_REGISTRY_URL, shadcnAddCommand } from "@/lib/glass-core/registry"
import { useT } from "@/lib/i18n/provider"
import { cn } from "@/lib/utils"
import { CopyButton } from "./copy-button"
import { NpmIcon } from "./npm-icon"
import { Reveal, RevealWords } from "./reveal"
import { Wallpaper } from "./wallpaper"

const MCP_SERVER_KEY = "glass-ui"

const CLAUDE_COMMAND = `claude mcp add ${MCP_SERVER_KEY} -- npx -y ${NPM_PACKAGES.mcp}`

const EDITOR_CONFIG = JSON.stringify(
  { mcpServers: { [MCP_SERVER_KEY]: { command: "npx", args: ["-y", NPM_PACKAGES.mcp] } } },
  null,
  2,
)

const CLI_COMMAND = `npx ${NPM_PACKAGES.core} add card`

/** The call an agent makes for "a frosted login card": real tool and argument names from the MCP server. */
const DEMO_TOOL = "generate_component"
const DEMO_ARGS = `{ component: "card", preset: "frosted" }`

const SHADCN_COMMAND = shadcnAddCommand("glass-card")
const REGISTRY_INDEX_URL = `${GLASS_UI_REGISTRY_URL}/registry.json`

type AgentCardLink = { href: string; label: string; kind: "npm" | "registry" }
type AgentCard = { Icon: LucideIcon; title: string; hint: string; snippet: string; link: AgentCardLink }

const npmLink = (name: NpmPackageName): AgentCardLink => ({ href: npmPackageUrl(name), label: name, kind: "npm" })

/**
 * The MCP section, the landing's main pitch: a demo of the round trip (what you ask, the tool call the agent
 * makes, the glass component you get), then the four ways to connect it.
 */
export function LandingAgents() {
  const t = useT()
  const cards: AgentCard[] = [
    { Icon: Bot, title: t("landing.agents.claude"), hint: t("landing.agents.claudeHint"), snippet: CLAUDE_COMMAND, link: npmLink(NPM_PACKAGES.mcp) },
    { Icon: Workflow, title: t("landing.agents.editors"), hint: t("landing.agents.editorsHint"), snippet: EDITOR_CONFIG, link: npmLink(NPM_PACKAGES.mcp) },
    { Icon: Terminal, title: t("landing.agents.cli"), hint: t("landing.agents.cliHint"), snippet: CLI_COMMAND, link: npmLink(NPM_PACKAGES.core) },
    {
      Icon: Layers,
      title: t("landing.agents.shadcn"),
      hint: t("landing.agents.shadcnHint"),
      snippet: SHADCN_COMMAND,
      link: { href: REGISTRY_INDEX_URL, label: "registry.json", kind: "registry" },
    },
  ]

  return (
    <section id="agents" className="relative mx-auto mt-32 w-full max-w-6xl scroll-mt-24 px-4 sm:px-6 md:mt-48">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/[0.08] bg-foreground/[0.03] px-5 py-14 sm:px-10 md:py-20">
        {/* Glow: plain radial gradients (no filter), so it costs nothing on phones. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-48 left-1/2 h-[560px] w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,_oklch(0.7_0.18_270_/_0.34),_transparent)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-48 -right-24 h-[440px] w-[440px] rounded-full bg-[radial-gradient(closest-side,_oklch(0.75_0.18_340_/_0.22),_transparent)]"
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <Reveal
            as="span"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground/[0.04] py-1 pl-1 pr-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground"
          >
            <span className="gg-agents-new rounded-full px-2 py-0.5 text-[9px] tracking-[0.16em] text-white">
              {t("landing.agents.new")}
            </span>
            {t("landing.agents.eyebrow")}
          </Reveal>
          <RevealWords
            text={t("landing.agents.title")}
            className="mt-6 text-balance text-4xl font-bold leading-[1.02] tracking-[-0.03em] text-foreground sm:text-5xl md:text-6xl"
          />
          <Reveal
            as="p"
            delay={2}
            className="mx-auto mt-6 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base"
          >
            {t("landing.agents.desc")}
          </Reveal>
        </div>

        {/* Demo: what you type, the call the agent makes, and what lands in your project. */}
        <div className="relative mt-14 grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12">
          <div className="flex flex-col gap-3">
            <Reveal as="span" delay={1} className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {t("landing.agents.demo.label")}
            </Reveal>
            <Reveal
              delay={2}
              className="self-end rounded-2xl rounded-br-md bg-foreground/[0.09] px-4 py-3 text-sm font-medium text-foreground sm:text-base"
            >
              {t("landing.agents.demo.prompt")}
              <span aria-hidden className="gg-caret" />
            </Reveal>
            <Reveal delay={4} className="rounded-2xl border border-border bg-background/60 p-4 font-mono text-[11px] leading-relaxed sm:text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" strokeWidth={2.2} />
                <span>
                  {MCP_SERVER_KEY} · <span className="text-foreground">{DEMO_TOOL}</span>
                </span>
              </div>
              <code className="mt-2 block [overflow-wrap:anywhere] text-foreground/90">{DEMO_ARGS}</code>
            </Reveal>
            <Reveal delay={6} className="flex items-start gap-2.5 text-sm text-foreground">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              <span>{t("landing.agents.demo.result")}</span>
            </Reveal>
          </div>

          <Reveal
            delay={5}
            className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-[0_40px_100px_-40px_oklch(0_0_0_/_0.8)]"
          >
            <Wallpaper id="aurora" />
            <div aria-hidden className="absolute inset-0">
              <span className="absolute left-[12%] top-[14%] aspect-square w-[30%] rounded-full bg-gradient-to-br from-[#ff7ac6] to-[#ff9f5a]" />
              <span className="absolute bottom-[10%] right-[10%] aspect-square w-[24%] rotate-12 rounded-[28%] bg-gradient-to-br from-[#3cd9f5] to-[#5b8cff]" />
            </div>
            <div className="absolute left-1/2 top-1/2 w-[min(78%,320px)] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/30 bg-white/15 p-5 shadow-[inset_0_1px_0_oklch(1_0_0_/_0.35),0_24px_60px_-24px_oklch(0_0_0_/_0.5)] backdrop-blur-xl backdrop-saturate-150">
              <p className="text-base font-semibold text-white">{t("landing.agents.demo.cardTitle")}</p>
              <div className="mt-4 space-y-2.5">
                <div className="rounded-xl border border-white/25 bg-white/10 px-3 py-2 text-xs text-white/75">
                  {t("landing.agents.demo.email")}
                </div>
                <div className="rounded-xl border border-white/25 bg-white/10 px-3 py-2 text-xs text-white/75">
                  {t("landing.agents.demo.password")}
                </div>
              </div>
              <div className="mt-4 rounded-xl bg-white/90 py-2 text-center text-xs font-semibold text-slate-900">
                {t("landing.agents.demo.submit")}
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal as="h3" className="relative mt-16 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {t("landing.agents.install")}
        </Reveal>
        <div className="relative mt-6 grid gap-4 md:grid-cols-2">
          {cards.map(({ Icon, title, hint, snippet, link }, i) => (
            <Reveal
              key={title}
              delay={1 + i}
              data-agent-card
              className={cn("gg-glass gg-glass-inset flex min-w-0 flex-col rounded-3xl p-6", i === 0 && "gg-agents-featured")}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-foreground/15 to-foreground/[0.04] shadow-[inset_0_1px_0_0_var(--gg-glass-inset-light)]">
                  <Icon className="h-4 w-4 text-foreground" strokeWidth={2.2} />
                </div>
                <div className="min-w-0">
                  <h4 className="truncate text-sm font-semibold tracking-tight text-foreground">{title}</h4>
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
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 self-start text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.kind === "npm" ? <NpmIcon className="h-3 w-3" /> : <Braces className="h-3 w-3" strokeWidth={2.2} />}
                <span className="font-mono">{link.label}</span>
                <ArrowUpRight className="h-3 w-3" strokeWidth={2.2} />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
