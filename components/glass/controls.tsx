"use client"

import { Moon, Sun, RotateCcw, Sliders, Type } from "lucide-react"
import { Segmented } from "./segmented"
import { cn } from "@/lib/utils"
import type {
  ComponentKind,
  GlassOptions,
  GlassBlur,
  GlassRounded,
  GlassIntensity,
  GlassBorder,
  GlassPadding,
  GlassShadow,
} from "@/lib/glass-core/types"

export const DEFAULT_OPTIONS: GlassOptions = {
  theme: "light",
  blur: "md",
  rounded: "2xl",
  intensity: "medium",
  border: "subtle",
  padding: "md",
  shadow: "md",
  text: "",
}

/** Per-component sensible defaults. */
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
        text: "Search…",
      }
    case "glass-card":
    default:
      return DEFAULT_OPTIONS
  }
}

const SIZE_LABEL: Record<ComponentKind, { label: string; description: string }> = {
  "glass-card": { label: "Padding", description: "Inner spacing" },
  "glass-button": { label: "Size", description: "Height + horizontal padding" },
  "glass-input": { label: "Size", description: "Height + horizontal padding" },
}

const TEXT_LABEL: Record<ComponentKind, { label: string; placeholder: string }> = {
  "glass-card": { label: "Title", placeholder: "Now Playing" },
  "glass-button": { label: "Label", placeholder: "Continue" },
  "glass-input": { label: "Placeholder", placeholder: "Search…" },
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
  const set = <K extends keyof GlassOptions>(key: K, value: GlassOptions[K]) =>
    onChange({ ...options, [key]: value })

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
        <div className="flex items-center gap-2">
          <Sliders className="h-3.5 w-3.5 text-muted-foreground" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Properties</h2>
        </div>
        <button
          type="button"
          onClick={() => onChange(defaultsFor(component))}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      {/* Scrollable content */}
      <div className="gg-scroll flex-1 space-y-5 overflow-y-auto px-5 py-5">
        {/* Theme */}
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Theme</label>
          <div className="grid grid-cols-2 gap-0.5 rounded-xl border border-white/5 bg-white/[0.03] p-0.5">
            <ThemeBtn active={options.theme === "light"} onClick={() => set("theme", "light")}>
              <Sun className="h-3.5 w-3.5" />
              Light
            </ThemeBtn>
            <ThemeBtn active={options.theme === "dark"} onClick={() => set("theme", "dark")}>
              <Moon className="h-3.5 w-3.5" />
              Dark
            </ThemeBtn>
          </div>
        </div>

        {/* Contextual text */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="gg-text"
              className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              {TEXT_LABEL[component].label}
            </label>
            <Type className="h-3 w-3 text-muted-foreground/60" />
          </div>
          <input
            id="gg-text"
            type="text"
            value={options.text ?? ""}
            placeholder={TEXT_LABEL[component].placeholder}
            onChange={(e) => set("text", e.target.value)}
            className="h-9 w-full rounded-lg border border-white/5 bg-white/[0.03] px-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary/40 focus:bg-white/[0.05]"
          />
        </div>

        <Segmented<GlassBlur>
          label="Blur"
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
          label="Intensity"
          description="Background opacity"
          options={[
            { value: "subtle", label: "Subtle" },
            { value: "medium", label: "Medium" },
            { value: "strong", label: "Strong" },
          ]}
          value={options.intensity}
          onChange={(v) => set("intensity", v)}
        />

        <Segmented<GlassRounded>
          label="Radius"
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
          label="Border"
          options={[
            { value: "none", label: "None" },
            { value: "subtle", label: "Subtle" },
            { value: "strong", label: "Strong" },
          ]}
          value={options.border}
          onChange={(v) => set("border", v)}
        />

        <Segmented<GlassPadding>
          label={SIZE_LABEL[component].label}
          description={SIZE_LABEL[component].description}
          options={[
            { value: "sm", label: "Small" },
            { value: "md", label: "Medium" },
            { value: "lg", label: "Large" },
          ]}
          value={options.padding}
          onChange={(v) => set("padding", v)}
        />

        <Segmented<GlassShadow>
          label="Shadow"
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
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Every change updates the live preview and the exported code. All utilities are{" "}
            <span className="font-medium text-foreground">NativeWind-compatible</span>.
          </p>
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
          ? "bg-white/10 text-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_1px_2px_0_rgba(0,0,0,0.3)]"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  )
}
