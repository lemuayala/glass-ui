import { cn } from "@/lib/utils"

export function glassMdLineMeta(line: string) {
  const trimmed = line.trimStart()
  return {
    trimmed,
    isHeading: trimmed.startsWith("#"),
    isTable: trimmed.startsWith("|"),
    isFence: trimmed.startsWith("```"),
    isBullet: trimmed.startsWith("- ["),
    isHr: /^---+$/.test(trimmed),
  }
}

export function GlassMdInline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter((p) => p.length > 0)

  if (parts.length === 1) return <>{text}</>

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-foreground">
              {part.slice(2, -2)}
            </strong>
          )
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <span
              key={i}
              className="rounded bg-foreground/[0.06] px-1 text-[0.95em] text-emerald-600 dark:text-emerald-400/90"
            >
              {part.slice(1, -1)}
            </span>
          )
        }
        return <span key={i}>{part}</span>
      })}
    </>
  )
}

export function GlassMdLine({
  line,
  lineNumber,
  className,
}: {
  line: string
  lineNumber?: number
  className?: string
}) {
  const { isHeading, isTable, isFence, isBullet, isHr } = glassMdLineMeta(line)

  return (
    <div className={cn("flex w-full min-w-0 gap-2 sm:gap-0", className)} data-line>
      {lineNumber != null ? (
        <span className="w-7 shrink-0 select-none text-right text-muted-foreground/40 tabular-nums sm:w-9 sm:pr-4">
          {lineNumber}
        </span>
      ) : null}
      <span
        className={cn(
          "min-w-0 flex-1",
          isTable && "block overflow-x-auto overscroll-x-contain whitespace-pre text-[10.5px] sm:text-[12.5px]",
          isFence && "whitespace-pre text-[10.5px] sm:text-[12.5px]",
          !isTable && !isFence && "whitespace-pre-wrap break-words",
          isHeading && "font-semibold text-primary",
          isFence && "text-emerald-500/90 dark:text-emerald-400/80",
          isTable && "text-muted-foreground",
          isBullet && "text-amber-600/90 dark:text-amber-300/90",
          isHr && "text-muted-foreground/50",
          !isHeading && !isFence && !isTable && !isBullet && !isHr && "text-foreground/85",
        )}
      >
        {line ? <GlassMdInline text={line} /> : "\u00A0"}
      </span>
    </div>
  )
}
