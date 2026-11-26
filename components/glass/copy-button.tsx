"use client"

import { useEffect, useState } from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

type CopyButtonProps = {
  text: string
  copyLabel: string
  copiedLabel: string
  className?: string
}

/** Pill that copies `text` to the clipboard and confirms for 1.6s. */
export function CopyButton({ text, copyLabel, copiedLabel, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const id = window.setTimeout(() => setCopied(false), 1600)
    return () => window.clearTimeout(id)
  }, [copied])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch {
      /* clipboard unavailable (insecure context) — the text stays selectable */
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? copiedLabel : copyLabel}
      className={cn(
        "flex h-7 shrink-0 items-center gap-1.5 rounded-full border border-border bg-foreground/[0.04] px-2.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-foreground/[0.08] hover:text-foreground",
        className,
      )}
    >
      {copied ? <Check className="h-3 w-3" strokeWidth={2.4} /> : <Copy className="h-3 w-3" strokeWidth={2.2} />}
      <span>{copied ? copiedLabel : copyLabel}</span>
    </button>
  )
}
