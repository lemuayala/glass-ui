"use client"

import { ChevronDown, FolderCode } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useT } from "@/lib/i18n/provider"
import { Segmented } from "./segmented"
import {
  PanelCheckbox,
  PanelField,
  PanelInput,
  PanelSelect,
} from "./panel-field"
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
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-foreground/[0.02]",
        "shadow-[inset_0_1px_0_0_var(--gg-glass-inset-light)]",
        "transition-colors duration-200",
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          "flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left",
          "transition-colors duration-200 hover:bg-foreground/[0.04]",
        )}
      >
        <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <FolderCode className="h-3.5 w-3.5 transition-colors duration-200" />
          {t("profile.title")}
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground transition-transform duration-300 ease-out",
            open && "rotate-180",
          )}
        />
      </button>

      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="space-y-3 border-t border-border px-3 pb-3 pt-3">
            <PanelField label={t("profile.framework")}>
              <PanelSelect<ProjectFramework>
                value={profile.framework}
                onValueChange={(framework) => onChange({ framework })}
                options={[
                  { value: "next-app-router", label: "Next.js App Router" },
                  { value: "vite-react", label: "Vite + React" },
                  { value: "expo", label: "Expo" },
                  { value: "other", label: t("profile.other") },
                ]}
              />
            </PanelField>

            <PanelField label={t("profile.path")}>
              <PanelInput
                type="text"
                value={profile.componentPath}
                onChange={(e) => onChange({ componentPath: e.target.value })}
                className="font-mono text-xs"
              />
            </PanelField>

            <Segmented<TailwindVersion>
              label={t("profile.tailwind")}
              size="sm"
              value={profile.tailwindVersion}
              onChange={(tailwindVersion) => onChange({ tailwindVersion })}
              options={[
                { value: "4", label: "v4" },
                { value: "3", label: "v3" },
              ]}
            />

            <Segmented<PackageManager>
              label={t("profile.pm")}
              size="sm"
              value={profile.packageManager}
              onChange={(packageManager) => onChange({ packageManager })}
              options={[
                { value: "npm", label: "npm" },
                { value: "pnpm", label: "pnpm" },
                { value: "yarn", label: "yarn" },
              ]}
            />

            <div className="min-h-[3.25rem] space-y-2 pt-0.5">
              <PanelCheckbox
                checked={profile.hasCnHelper}
                onCheckedChange={(hasCnHelper) => onChange({ hasCnHelper })}
                label={t("profile.hasCn")}
              />
              <PanelCheckbox
                checked={profile.usesShadcn}
                onCheckedChange={(usesShadcn) => onChange({ usesShadcn })}
                label={t("profile.shadcn")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
