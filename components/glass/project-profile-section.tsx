"use client"

import { ChevronDown, FolderCode } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useT } from "@/lib/i18n/provider"
import type {
  PackageManager,
  ProjectFramework,
  ProjectProfile,
  TailwindVersion,
} from "@/lib/glass-core/project-profile"

export function ProjectProfileSection({
  profile,
  onChange,
}: {
  profile: ProjectProfile
  onChange: (patch: Partial<ProjectProfile>) => void
}) {
  const t = useT()
  const [open, setOpen] = useState(true)

  return (
    <div className="rounded-xl border border-border bg-foreground/[0.02]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left"
      >
        <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <FolderCode className="h-3.5 w-3.5" />
          {t("profile.title")}
        </span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="space-y-3 border-t border-border px-3 pb-3 pt-2">
          <Field label={t("profile.framework")}>
            <select
              value={profile.framework}
              onChange={(e) => onChange({ framework: e.target.value as ProjectFramework })}
              className="h-8 w-full rounded-lg border border-border bg-foreground/[0.03] px-2 text-xs text-foreground outline-none focus:border-primary/40"
            >
              <option value="next-app-router">Next.js App Router</option>
              <option value="vite-react">Vite + React</option>
              <option value="expo">Expo</option>
              <option value="other">{t("profile.other")}</option>
            </select>
          </Field>
          <Field label={t("profile.path")}>
            <input
              type="text"
              value={profile.componentPath}
              onChange={(e) => onChange({ componentPath: e.target.value })}
              className="h-8 w-full rounded-lg border border-border bg-foreground/[0.03] px-2 font-mono text-xs text-foreground outline-none focus:border-primary/40"
            />
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label={t("profile.tailwind")}>
              <select
                value={profile.tailwindVersion}
                onChange={(e) => onChange({ tailwindVersion: e.target.value as TailwindVersion })}
                className="h-8 w-full rounded-lg border border-border bg-foreground/[0.03] px-2 text-xs"
              >
                <option value="4">v4</option>
                <option value="3">v3</option>
              </select>
            </Field>
            <Field label={t("profile.pm")}>
              <select
                value={profile.packageManager}
                onChange={(e) => onChange({ packageManager: e.target.value as PackageManager })}
                className="h-8 w-full rounded-lg border border-border bg-foreground/[0.03] px-2 text-xs"
              >
                <option value="npm">npm</option>
                <option value="pnpm">pnpm</option>
                <option value="yarn">yarn</option>
              </select>
            </Field>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-[11px] text-muted-foreground">
            <input
              type="checkbox"
              checked={profile.hasCnHelper}
              onChange={(e) => onChange({ hasCnHelper: e.target.checked })}
              className="rounded border-border"
            />
            {t("profile.hasCn")}
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-[11px] text-muted-foreground">
            <input
              type="checkbox"
              checked={profile.usesShadcn}
              onChange={(e) => onChange({ usesShadcn: e.target.checked })}
              className="rounded border-border"
            />
            {t("profile.shadcn")}
          </label>
        </div>
      )}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/80">{label}</span>
      {children}
    </div>
  )
}
