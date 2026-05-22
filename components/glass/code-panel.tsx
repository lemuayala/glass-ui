"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Highlight, themes, type PrismTheme } from "prism-react-renderer"
import { toast } from "sonner"
import { Copy, Download, Code2, Layers, FileText, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useT } from "@/lib/i18n/provider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { ComponentKind, ExportMode, Platform } from "@/lib/glass-core/types"

type ExportView = "code" | "glass"

export function CodePanel({
  code,
  usageSnippet,
  glassPrompt,
  shortGlassPrompt,
  component,
  mode,
  onMode,
  platform,
  onPlatform,
}: {
  code: string
  usageSnippet: string
  glassPrompt: string
  shortGlassPrompt: string
  component: ComponentKind
  mode: ExportMode
  onMode: (m: ExportMode) => void
  platform: Platform
  onPlatform: (p: Platform) => void
}) {
  const t = useT()
  const { resolvedTheme } = useTheme()
  const [view, setView] = useState<ExportView>("code")
  const [copiedGlass, setCopiedGlass] = useState(false)
  const [copiedShort, setCopiedShort] = useState(false)

  const cursorDark: PrismTheme = {
    plain: { color: "#d4d4d4", backgroundColor: "#0a0a0a" },
    styles: [
      { types: ["comment", "prolog", "doctype", "cdata"], style: { color: "#7B7F8B", fontStyle: "italic" } },
      { types: ["punctuation", "operator"], style: { color: "#D4D4D4" } },
      { types: ["string", "attr-value", "regex", "inserted"], style: { color: "#CE9178" } },
      { types: ["number", "boolean", "constant", "symbol", "deleted"], style: { color: "#B5CEA8" } },
      { types: ["keyword", "atrule"], style: { color: "#C586C0" } },
      { types: ["function", "function-variable"], style: { color: "#DCDCAA" } },
      { types: ["class-name", "maybe-class-name"], style: { color: "#4EC9B0" } },
      { types: ["property", "variable"], style: { color: "#9CDCFE" } },
      { types: ["tag", "attr-name", "selector"], style: { color: "#569CD6" } },
    ],
  }

  const prismTheme = resolvedTheme === "light" ? themes.vsLight : cursorDark
  const isReusable = mode === "reusable"
  const isGlass = view === "glass"

  async function copyText(text: string, onDone: () => void, toastKey: "code" | "glass" = "glass") {
    try {
      await navigator.clipboard.writeText(text)
      onDone()
      if (toastKey === "glass") {
        toast.success(t("glass.toast.copied.title"), { description: t("glass.toast.copied.description") })
      } else {
        toast.success(t("code.toast.title"), { description: t("code.toast.description") })
      }
    } catch {
      /* ignore */
    }
  }

  const handleCopy = async () => {
    await copyText(code, () => {}, "code")
  }

  const handleCopyUsageOnly = async () => {
    try {
      await navigator.clipboard.writeText(usageSnippet)
      toast.success(t("code.toast.usageOnly.title"), { description: t("code.toast.usageOnly.description") })
    } catch {
      /* ignore */
    }
  }

  const handleDownload = () => {
    const content = isGlass ? glassPrompt : code
    const ext = isGlass ? "md" : "tsx"
    const name = isGlass ? `GLASS-${component.replace("glass-", "")}` : mode === "inline" ? "glass-snippet" : "glass-component"
    const blob = new Blob([content], { type: isGlass ? "text/markdown" : "text/typescript" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${name}.${ext}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const displayCode = isGlass ? glassPrompt : code
  const displayLang = isGlass ? "markdown" : "tsx"

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          {isGlass ? (
            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <Code2 className="h-3.5 w-3.5 text-muted-foreground" />
          )}
          <div className="flex items-center gap-0.5 rounded-full border border-border bg-foreground/[0.03] p-0.5">
            <ModeTab active={view === "code"} onClick={() => setView("code")}>
              {t("panel.code")}
            </ModeTab>
            <ModeTab active={view === "glass"} onClick={() => setView("glass")}>
              GLASS.md
            </ModeTab>
          </div>
          {isGlass && (
            <span className="text-[10px] tabular-nums text-muted-foreground/60">
              {glassPrompt.length.toLocaleString()} {t("glass.chars")}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isGlass && (
            <>
              <div className="flex items-center gap-0.5 rounded-full border border-border bg-foreground/[0.03] p-0.5">
                <ModeTab active={platform === "web"} onClick={() => onPlatform("web")}>
                  Web
                </ModeTab>
                <ModeTab active={platform === "native"} onClick={() => onPlatform("native")}>
                  Native
                </ModeTab>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-0.5 rounded-full border border-border bg-foreground/[0.03] p-0.5">
                <ModeTab active={mode === "inline"} onClick={() => onMode("inline")}>
                  {t("code.inline")}
                </ModeTab>
                <ModeTab active={mode === "reusable"} onClick={() => onMode("reusable")}>
                  {t("code.reusable")}
                </ModeTab>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <Highlight code={displayCode.trim()} language={displayLang} theme={prismTheme}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={cn(
                className,
                "gg-scroll h-full overflow-auto px-5 py-4 font-mono text-[12.5px] leading-relaxed",
              )}
              style={{ ...style, backgroundColor: "transparent" }}
            >
              {tokens.map((line, i) => {
                const lineProps = getLineProps({ line })
                return (
                  <div key={i} {...lineProps} className={cn(lineProps.className, "table-row")}>
                    <span className="table-cell select-none pr-4 text-right text-muted-foreground/40 tabular-nums">
                      {i + 1}
                    </span>
                    <span className="table-cell whitespace-pre-wrap break-words">
                      {line.map((token, key) => {
                        const tokenProps = getTokenProps({ token })
                        return <span key={key} {...tokenProps} />
                      })}
                    </span>
                  </div>
                )
              })}
            </pre>
          )}
        </Highlight>

        <div className="absolute right-4 top-4 flex items-center gap-1.5">
          <TooltipProvider>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-foreground/[0.04] text-muted-foreground backdrop-blur-md transition-all hover:bg-foreground/[0.08] hover:text-foreground"
                  aria-label={t("actions.download")}
                >
                  <Download className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={6}>
                {t("actions.download")}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {isGlass ? (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  copyText(shortGlassPrompt, () => {
                    setCopiedShort(true)
                    window.setTimeout(() => setCopiedShort(false), 2000)
                  })
                }
                className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-foreground/[0.04] px-2.5 text-xs font-medium text-muted-foreground backdrop-blur-md transition-all hover:bg-foreground/[0.08] hover:text-foreground"
              >
                {copiedShort ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span className="hidden sm:inline">{t("glass.quick")}</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  copyText(glassPrompt, () => {
                    setCopiedGlass(true)
                    window.setTimeout(() => setCopiedGlass(false), 2000)
                  })
                }
                className="flex h-8 items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-2.5 text-xs font-medium text-primary backdrop-blur-md transition-all hover:bg-primary/20"
              >
                {copiedGlass ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span className="hidden sm:inline">{t("glass.copyAll")}</span>
              </button>
            </div>
          ) : isReusable ? (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleCopyUsageOnly}
                className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-foreground/[0.04] px-2.5 text-xs font-medium text-muted-foreground backdrop-blur-md transition-all hover:bg-foreground/[0.08] hover:text-foreground"
              >
                <Copy className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t("actions.copyUsageOnly")}</span>
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="flex h-8 items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-2.5 text-xs font-medium text-primary backdrop-blur-md transition-all hover:bg-primary/20"
              >
                <Layers className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t("actions.copy")}</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleCopy}
              className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-foreground/[0.04] px-3 text-xs font-medium text-muted-foreground backdrop-blur-md transition-all hover:bg-foreground/[0.08] hover:text-foreground"
            >
              <Copy className="h-3.5 w-3.5" />
              {t("actions.copy")}
            </button>
          )}
        </div>
      </div>

      {isGlass ? (
        <div className="border-t border-border/60 bg-foreground/[0.02] px-4 py-2.5">
          <p className="text-[11px] font-medium text-muted-foreground">{t("glass.howTo.title")}</p>
          <ol className="mt-1 list-inside list-decimal space-y-0.5 text-[11px] leading-relaxed text-muted-foreground/90">
            <li>{t("glass.howTo.step1")}</li>
            <li>{t("glass.howTo.step2")}</li>
            <li>{t("glass.howTo.step3")}</li>
          </ol>
        </div>
      ) : isReusable ? (
        <div className="flex items-start gap-2.5 border-t border-border/60 bg-primary/[0.04] px-4 py-2.5">
          <Layers className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/70" />
          <p className="text-[11px] leading-relaxed text-muted-foreground">{t("code.reusable.callout")}</p>
        </div>
      ) : null}
    </div>
  )
}

function ModeTab({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full px-3.5 py-1 text-[11px] font-medium transition-all duration-200",
        active
          ? "bg-foreground/10 text-foreground shadow-[inset_0_1px_0_0_var(--gg-glass-inset-light)]"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  )
}
