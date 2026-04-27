"use client"

import { useState } from "react"
import { Highlight, themes } from "prism-react-renderer"
import { Check, Copy, Download, Code2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ExportMode } from "@/lib/glass-core/types"

export function CodePanel({
  code,
  mode,
  onMode,
}: {
  code: string
  mode: ExportMode
  onMode: (m: ExportMode) => void
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // ignore — environment without clipboard
    }
  }

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/typescript" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = mode === "inline" ? "glass-card-snippet.tsx" : "glass-card.tsx"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-white/5 px-5 py-3">
        <div className="flex items-center gap-2">
          <Code2 className="h-3.5 w-3.5 text-muted-foreground" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Code</h2>
        </div>

        {/* Mode tabs */}
        <div className="flex items-center gap-0.5 rounded-full border border-white/5 bg-white/[0.03] p-0.5">
          <ModeTab active={mode === "inline"} onClick={() => onMode("inline")}>
            Inline
          </ModeTab>
          <ModeTab active={mode === "reusable"} onClick={() => onMode("reusable")}>
            Reusable
          </ModeTab>
        </div>
      </div>

      {/* Code area */}
      <div className="relative flex-1 overflow-hidden">
        <Highlight code={code.trim()} language="tsx" theme={themes.vsDark}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={cn(
                className,
                "gg-scroll h-full overflow-auto px-5 py-4 font-mono text-[12.5px] leading-relaxed",
              )}
              style={{ ...style, background: "transparent" }}
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
          <button
            type="button"
            onClick={handleDownload}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 bg-white/[0.04] text-muted-foreground backdrop-blur-md transition-all hover:bg-white/[0.08] hover:text-foreground"
            title="Download .tsx"
            aria-label="Download as .tsx file"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className={cn(
              "flex h-8 items-center gap-1.5 rounded-lg border border-white/5 bg-white/[0.04] px-3 text-xs font-medium text-muted-foreground backdrop-blur-md transition-all hover:bg-white/[0.08] hover:text-foreground",
              copied && "border-primary/40 bg-primary/15 text-primary hover:bg-primary/15 hover:text-primary",
            )}
            aria-label="Copy code"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
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
          ? "bg-white/10 text-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  )
}
