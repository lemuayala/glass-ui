"use client"

import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

/** Shared field chrome — follows app light/dark via CSS variables. */
export const panelInputClassName = cn(
  "h-9 w-full rounded-lg border border-border bg-foreground/[0.03] px-3 text-sm text-foreground",
  "placeholder:text-muted-foreground/60",
  "shadow-[inset_0_1px_0_0_var(--gg-glass-inset-light)]",
  "outline-none transition-all duration-200",
  "hover:bg-foreground/[0.05]",
  "focus:border-primary/40 focus:bg-foreground/[0.05]",
)

export const panelSelectTriggerClassName = cn(
  "flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-border",
  "bg-foreground/[0.03] px-3 text-xs font-medium text-foreground",
  "shadow-[inset_0_1px_0_0_var(--gg-glass-inset-light)]",
  "outline-none transition-all duration-200",
  "hover:bg-foreground/[0.05]",
  "focus:border-primary/40 focus:ring-0 focus-visible:ring-0",
  "data-[placeholder]:text-muted-foreground",
  "[&_svg]:size-3.5 [&_svg]:opacity-50",
)

export const panelSelectContentClassName = cn(
  "z-[100] overflow-hidden rounded-xl border border-border p-1",
  "bg-popover text-popover-foreground",
  "shadow-[0_16px_40px_-12px_var(--gg-glass-inset-dark)]",
  "backdrop-blur-xl backdrop-saturate-150",
  "data-[state=open]:animate-in data-[state=closed]:animate-out",
  "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
  "data-[side=bottom]:slide-in-from-top-2",
)

export const panelSelectItemClassName = cn(
  "relative cursor-pointer rounded-lg py-2 pr-8 pl-2.5 text-xs text-foreground",
  "transition-colors duration-150",
  "focus:bg-foreground/10 focus:text-foreground",
  "data-[highlighted]:bg-foreground/10 data-[highlighted]:text-foreground",
)

export function PanelField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </div>
  )
}

export function PanelInput(props: React.ComponentProps<"input">) {
  return <input {...props} className={cn(panelInputClassName, props.className)} />
}

export function PanelSelect<T extends string>({
  value,
  onValueChange,
  placeholder,
  options,
}: {
  value: T
  onValueChange: (v: T) => void
  placeholder?: string
  options: { value: T; label: string }[]
}) {
  return (
    <Select value={value} onValueChange={(v) => onValueChange(v as T)}>
      <SelectTrigger className={panelSelectTriggerClassName} size="sm">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className={panelSelectContentClassName} position="popper">
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value} className={panelSelectItemClassName}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function PanelCheckbox({
  checked,
  onCheckedChange,
  label,
}: {
  checked: boolean
  onCheckedChange: (v: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className="group flex min-h-6 w-full cursor-pointer items-center gap-2.5 text-left text-[11px] text-muted-foreground transition-colors duration-200 hover:text-foreground"
    >
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-md border border-border",
          "bg-foreground/[0.03] shadow-[inset_0_1px_0_0_var(--gg-glass-inset-light)]",
          "transition-colors duration-200",
          "group-hover:border-foreground/20 group-hover:bg-foreground/[0.06]",
          checked && "border-primary/50 bg-primary/15",
        )}
      >
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-[2px] bg-primary transition-opacity duration-200",
            checked ? "opacity-100" : "opacity-0",
          )}
        />
      </span>
      {label}
    </button>
  )
}
