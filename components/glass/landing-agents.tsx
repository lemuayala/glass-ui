"use client"

import { ArrowUpRight, Bot, Braces, Layers, Terminal, Workflow } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { NPM_PACKAGES, npmPackageUrl } from "@/lib/config"
import type { NpmPackageName } from "@/lib/config"
import { GLASS_UI_REGISTRY_URL, shadcnAddCommand } from "@/lib/glass-core/registry"
import { useT } from "@/lib/i18n/provider"
import { CopyButton } from "./copy-button"
import { NpmIcon } from "./npm-icon"
import { Reveal, RevealWords } from "./reveal"

const MCP_SERVER_KEY = "glass-ui"

const CLAUDE_COMMAND = `claude mcp add ${MCP_SERVER_KEY} -- npx -y ${NPM_PACKAGES.mcp}`

const EDITOR_CONFIG = JSON.stringify(
  { mcpServers: { [MCP_SERVER_KEY]: { command: "npx", args: ["-y", NPM_PACKAGES.mcp] } } },
  null,
  2,
)

const CLI_COMMAND = `npx ${NPM_PACKAGES.core} add card`

const SHADCN_COMMAND = shadcnAddCommand("glass-card")
const REGISTRY_INDEX_URL = `${GLASS_UI_REGISTRY_URL}/registry.json`

type AgentCardLink = { href: string; label: string; kind: "npm" | "registry" }
type AgentCard = { Icon: LucideIcon; title: string; hint: string; snippet: string; link: AgentCardLink }

const npmLink = (name: NpmPackageName): AgentCardLink => ({ href: npmPackageUrl(name), label: name, kind: "npm" })

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
    <section
      id="agents"
      className="relative mx-auto mt-32 w-full max-w-6xl scroll-mt-24 px-6 md:mt-48"
    >
      <div className="mx-auto max-w-3xl text-center">
        <Reveal as="span" className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {t("landing.agents.eyebrow")}
        </Reveal>
        <RevealWords
          text={t("landing.agents.title")}
          className="mt-5 text-balance text-3xl font-bold leading-[1.05] tracking-[-0.02em] text-foreground sm:text-4xl md:text-5xl"
        />
        <Reveal as="p" delay={2} className="mx-auto mt-5 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          {t("landing.agents.desc")}
        </Reveal>
      </div>

      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {cards.map(({ Icon, title, hint, snippet, link }, i) => (
          <Reveal
            key={title}
            delay={2 + i}
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
    </section>
  )
}
