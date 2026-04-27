"use client"

import { Moon, Sun, RotateCcw, Sliders, Type, Droplet } from "lucide-react"
import { Segmented } from "./segmented"
import { cn } from "@/lib/utils"
import { useT } from "@/lib/i18n/provider"
import type { TranslationKey } from "@/lib/i18n/dictionaries"
import type {
  ComponentKind,
  GlassOptions,
  GlassBlur,
  GlassRounded,
  GlassIntensity,
  GlassBorder,
  GlassPadding,
  GlassShadow,
  GlassTint,
} from "@/lib/glass-core/types"

export const DEFAULT_OPTIONS: GlassOptions = {
  theme: "light",
  blur: "md",
  rounded: "2xl",
  intensity: "medium",
  border: "subtle",
  padding: "md",
  shadow: "md",
  tint: "none",
  text: "",
}

export function defaultsFor(component: ComponentKind): GlassOptions {
  switch (component) {
    case "glass-button":
      return {
        theme: "dark",
        blur: "md",
        rounded: "full",
        intensity: "medium",
        border: "subtle",
        padding: "md",
        shadow: "md",
        tint: "none",
        text: "Continue",
      }
    case "glass-input":
      return {
        theme: "dark",
        blur: "md",
        rounded: "xl",
        intensity: "medium",
        border: "subtle",
        padding: "md",
        shadow: "sm",
        tint: "none",
        text: "Search…",
      }
    case "glass-modal":
      return {
        theme: "dark",
        blur: "xl",
        rounded: "3xl",
        intensity: "medium",
        border: "subtle",
        padding: "lg",
        shadow: "lg",
        tint: "none",
        text: "Confirm action",
      }
    case "glass-tabbar":
      return {
        theme: "dark",
        blur: "xl",
        rounded: "full",
        intensity: "medium",
        border: "subtle",
        padding: "md",
        shadow: "lg",
        tint: "none",
        text: "",
      }
    case "glass-card":
    default:
      return DEFAULT_OPTIONS
  }
}

const SIZE_KEY: Record<ComponentKind, { label: TranslationKey; description: TranslationKey }> = {
  "glass-card": { label: "panel.padding", description: "panel.padding.desc" },
  "glass-button": { label: "panel.size", description: "panel.size.desc" },
  "glass-input": { label: "panel.size", description: "panel.size.desc" },
  "glass-modal": { label: "panel.padding", description: "panel.padding.desc" },
  "glass-tabbar": { label: "panel.height", description: "panel.height.desc" },
}

const TEXT_KEY: Record<ComponentKind, { label: TranslationKey | null; placeholder: string }> = {
  "glass-card": { label: "panel.title", placeholder: "Now Playing" },
  "glass-button": { label: "panel.label", placeholder: "Continue" },
  "glass-input": { label: "panel.placeholder", placeholder: "Search…" },
  "glass-modal": { label: "panel.title", placeholder: "Confirm action" },
  "glass-tabbar": { label: null, placeholder: "" },
}

const TINT_DOT: Record<GlassTint, string> = {
  none: "bg-foreground/30",
  blue: "bg-blue-500",
  pink: "bg-pink-500",
  orange: "bg-orange-500",
  teal: "bg-teal-500",
}

export function Controls({
  component,
  options,
  onChange,
}: {
  component: ComponentKind
  options: GlassOptions
  onChange: (next: GlassOptions) => void
}) {
  const t = useT()
  const set = <K extends keyof GlassOptions>(key: K, value: GlassOptions[K]) =>
    onChange({ ...options, [key]: value })

  const textCfg = TEXT_KEY[component]
  const sizeCfg = SIZE_KEY[component]

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <Sliders className="h-3.5 w-3.5 text-muted-foreground" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("panel.properties")}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => onChange(defaultsFor(component))}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
        >
          <RotateCcw className="h-3 w-3" />
          {t("actions.reset")}
        </button>
      </div>

      {/* Scrollable content */}
      <div className="gg-scroll flex-1 space-y-5 overflow-y-auto px-5 py-5">
        {/* Theme (component-level, NOT app-level) */}
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t("panel.theme")}
          </label>
          <div className="grid grid-cols-2 gap-0.5 rounded-xl border border-border bg-foreground/[0.03] p-0.5">
            <ThemeBtn active={options.theme === "light"} onClick={() => set("theme", "light")}>
              <Sun className="h-3.5 w-3.5" />
              {t("panel.theme.light")}
            </ThemeBtn>
            <ThemeBtn active={options.theme === "dark"} onClick={() => set("theme", "dark")}>
              <Moon className="h-3.5 w-3.5" />
              {t("panel.theme.dark")}
            </ThemeBtn>
          </div>
        </div>

        {/* Tint */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t("panel.tint")}
            </label>
            <Droplet className="h-3 w-3 text-muted-foreground/60" />
          </div>
          <div className="grid grid-cols-5 gap-0.5 rounded-xl border border-border bg-foreground/[0.03] p-0.5">
            {(["none", "blue", "pink", "orange", "teal"] as GlassTint[]).map((tn) => {
              const active = options.tint === tn
              return (
                <button
                  key={tn}
                  type="button"
                  onClick={() => set("tint", tn)}
                  aria-pressed={active}
                  aria-label={tn}
                  title={tn}
                  className={cn(
                    "group flex h-8 items-center justify-center rounded-[10px] transition-all duration-200",
                    active
                      ? "bg-foreground/10 shadow-[inset_0_1px_0_0_var(--gg-glass-inset-light),0_1px_2px_0_var(--gg-glass-inset-dark)]"
                      : "hover:bg-foreground/[0.04]",
                  )}
                >
                  <span
                    className={cn(
                      "h-3.5 w-3.5 rounded-full ring-1",
                      TINT_DOT[tn],
                      active ? "ring-foreground/30" : "ring-foreground/10",
                    )}
                  />
                </button>
              )
            })}
          </div>
        </div>

        {/* Contextual text */}
        {textCfg.label && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="gg-text"
                className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                {t(textCfg.label)}
              </label>
              <Type className="h-3 w-3 text-muted-foreground/60" />
            </div>
            <input
              id="gg-text"
              type="text"
              value={options.text ?? ""}
              placeholder={textCfg.placeholder}
              onChange={(e) => set("text", e.target.value)}
              className="h-9 w-full rounded-lg border border-border bg-foreground/[0.03] px-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary/40 focus:bg-foreground/[0.05]"
            />
          </div>
        )}

        <Segmented<GlassBlur>
          label={t("panel.blur")}
          options={[
            { value: "none", label: "None" },
            { value: "sm", label: "SM" },
            { value: "md", label: "MD" },
            { value: "lg", label: "LG" },
            { value: "xl", label: "XL" },
          ]}
          value={options.blur}
          onChange={(v) => set("blur", v)}
          size="sm"
        />

        <Segmented<GlassIntensity>
          label={t("panel.intensity")}
          description={t("panel.intensity.desc")}
          options={[
            { value: "subtle", label: "Subtle" },
            { value: "medium", label: "Medium" },
            { value: "strong", label: "Strong" },
          ]}
          value={options.intensity}
          onChange={(v) => set("intensity", v)}
        />

        <Segmented<GlassRounded>
          label={t("panel.radius")}
          options={[
            { value: "none", label: "0" },
            { value: "md", label: "MD" },
            { value: "lg", label: "LG" },
            { value: "xl", label: "XL" },
            { value: "2xl", label: "2XL" },
            { value: "3xl", label: "3XL" },
            { value: "full", label: "Full" },
          ]}
          value={options.rounded}
          onChange={(v) => set("rounded", v)}
          size="sm"
        />

        <Segmented<GlassBorder>
          label={t("panel.border")}
          options={[
            { value: "none", label: "None" },
            { value: "subtle", label: "Subtle" },
            { value: "strong", label: "Strong" },
          ]}
          value={options.border}
          onChange={(v) => set("border", v)}
        />

        <Segmented<GlassPadding>
          label={t(sizeCfg.label)}
          description={t(sizeCfg.description)}
          options={[
            { value: "sm", label: "Small" },
            { value: "md", label: "Medium" },
            { value: "lg", label: "Large" },
          ]}
          value={options.padding}
          onChange={(v) => set("padding", v)}
        />

        <Segmented<GlassShadow>
          label={t("panel.shadow")}
          options={[
            { value: "none", label: "None" },
            { value: "sm", label: "SM" },
            { value: "md", label: "MD" },
            { value: "lg", label: "LG" },
          ]}
          value={options.shadow}
          onChange={(v) => set("shadow", v)}
        />

        {/* Footer hint */}
        <div className="rounded-xl border border-border bg-foreground/[0.02] p-3">
          <p className="text-[11px] leading-relaxed text-muted-foreground">{t("panel.footer")}</p>
        </div>
      </div>
    </div>
  )
}

function ThemeBtn({
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
        "flex items-center justify-center gap-1.5 rounded-[10px] px-3 py-2 text-xs font-medium transition-all duration-200",
        active
          ? "bg-foreground/10 text-foreground shadow-[inset_0_1px_0_0_var(--gg-glass-inset-light),0_1px_2px_0_var(--gg-glass-inset-dark)]"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  )
}
