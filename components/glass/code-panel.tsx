"use client"

import { useTheme } from "next-themes"
import { Highlight, themes, type PrismTheme } from "prism-react-renderer"
import { toast } from "sonner"
import { Copy, Download, Code2, Layers } from "lucide-react"
import { cn } from "@/lib/utils"
import { useT } from "@/lib/i18n/provider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { ExportMode, Platform } from "@/lib/glass-core/types"

export function CodePanel({
  code,
  usageSnippet,
  mode,
  onMode,
  platform,
  onPlatform,
}: {
  code: string
  usageSnippet: string
  mode: ExportMode
  onMode: (m: ExportMode) => void
  platform: Platform
  onPlatform: (p: Platform) => void
}) {
  const t = useT()
  const { resolvedTheme } = useTheme()

  // Custom Cursor-like Dark Theme
  const cursorDark: PrismTheme = {
    plain: {
      color: "#d4d4d4",
      backgroundColor: "#0a0a0a",
    },
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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      toast.success(t("code.toast.title"), {
        description: t("code.toast.description"),
      })
    } catch {
      // ignore — environment without clipboard
    }
  }

  const handleCopyWithUsage = async () => {
    try {
      const full = `${code}\n\n// --- Usage ---\n${usageSnippet}`
      await navigator.clipboard.writeText(full)
      toast.success(t("code.toast.withUsage.title"), {
        description: t("code.toast.withUsage.description"),
      })
    } catch {
      // ignore
    }
  }

  const handleCopyUsageOnly = async () => {
    try {
      await navigator.clipboard.writeText(usageSnippet)
      toast.success(t("code.toast.usageOnly.title"), {
        description: t("code.toast.usageOnly.description"),
      })
    } catch {
      // ignore
    }
  }

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/typescript" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = mode === "inline" ? "glass-snippet.tsx" : "glass-component.tsx"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const isReusable = mode === "reusable"

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <Code2 className="h-3.5 w-3.5 text-muted-foreground" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("panel.code")}
          </h2>
        </div>

        {/* Switchers */}
        <div className="flex items-center gap-3">
          {/* Platform tabs */}
          <div className="flex items-center gap-0.5 rounded-full border border-border bg-foreground/[0.03] p-0.5">
            <ModeTab active={platform === "web"} onClick={() => onPlatform("web")}>
              Web
            </ModeTab>
            <ModeTab active={platform === "native"} onClick={() => onPlatform("native")}>
              Native
            </ModeTab>
          </div>

          <div className="h-4 w-px bg-border" />

          {/* Mode tabs */}
          <div className="flex items-center gap-0.5 rounded-full border border-border bg-foreground/[0.03] p-0.5">
            <ModeTab active={mode === "inline"} onClick={() => onMode("inline")}>
              {t("code.inline")}
            </ModeTab>
            <ModeTab active={mode === "reusable"} onClick={() => onMode("reusable")}>
              {t("code.reusable")}
            </ModeTab>
          </div>
        </div>
      </div>

      {/* Code area */}
      <div className="relative flex-1 overflow-hidden">
        <Highlight code={code.trim()} language="tsx" theme={prismTheme}>
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

        {/* Floating actions */}
        <div className="absolute right-4 top-4 flex items-center gap-1.5">
          {/* Download */}
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

          {isReusable ? (
            /* Reusable mode: two copy buttons */
            <div className="flex items-center gap-1">
              {/* Copy usage only */}
              <TooltipProvider>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={handleCopyUsageOnly}
                      className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-foreground/[0.04] px-2.5 text-xs font-medium text-muted-foreground backdrop-blur-md transition-all hover:bg-foreground/[0.08] hover:text-foreground"
                      aria-label={t("actions.copyUsageOnly")}
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">{t("actions.copyUsageOnly")}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={6} className="max-w-[220px] text-center">
                    {t("actions.copyUsageOnly")}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Copy component file */}
              <TooltipProvider>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="flex h-8 items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-2.5 text-xs font-medium text-primary backdrop-blur-md transition-all hover:bg-primary/20"
                      aria-label={t("actions.copy")}
                    >
                      <Layers className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">{t("actions.copy")}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={6} className="max-w-[240px] text-center">
                    {t("actions.copy")}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ) : (
            /* Inline mode: single copy button */
            <button
              type="button"
              onClick={handleCopy}
              className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-foreground/[0.04] px-3 text-xs font-medium text-muted-foreground backdrop-blur-md transition-all hover:bg-foreground/[0.08] hover:text-foreground"
              aria-label={t("actions.copy")}
            >
              <Copy className="h-3.5 w-3.5" />
              {t("actions.copy")}
            </button>
          )}
        </div>
      </div>

      {/* Reusable callout banner */}
      {isReusable && (
        <div className="flex items-start gap-2.5 border-t border-border/60 bg-primary/[0.04] px-4 py-2.5">
          <Layers className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/70" />
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            {t("code.reusable.callout")}
          </p>
        </div>
      )}
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
