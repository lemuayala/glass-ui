"use client"

import { cn } from "@/lib/utils"

export type WallpaperId = "sunset" | "aurora" | "ocean" | "ember" | "mono"

export const WALLPAPERS: { id: WallpaperId; label: string; preview: string; bg: string }[] = [
  {
    id: "sunset",
    label: "Sunset",
    preview: "linear-gradient(135deg, #ff7a59 0%, #ff3d7f 50%, #ffb648 100%)",
    bg: "radial-gradient(at 18% 22%, #ff7a59 0px, transparent 55%), radial-gradient(at 78% 14%, #ff3d7f 0px, transparent 55%), radial-gradient(at 60% 88%, #ffb648 0px, transparent 55%), linear-gradient(135deg, #2a0f1a 0%, #3a1410 100%)",
  },
  {
    id: "aurora",
    label: "Aurora",
    preview: "linear-gradient(135deg, #00d4ff 0%, #0a84ff 50%, #38f9d7 100%)",
    bg: "radial-gradient(at 20% 30%, #0a84ff 0px, transparent 55%), radial-gradient(at 80% 10%, #00d4ff 0px, transparent 55%), radial-gradient(at 70% 80%, #38f9d7 0px, transparent 55%), linear-gradient(135deg, #051026 0%, #0a1a3a 100%)",
  },
  {
    id: "ocean",
    label: "Ocean",
    preview: "linear-gradient(135deg, #1e3a8a 0%, #0ea5e9 50%, #06b6d4 100%)",
    bg: "radial-gradient(at 30% 20%, #1e3a8a 0px, transparent 50%), radial-gradient(at 70% 70%, #0ea5e9 0px, transparent 55%), radial-gradient(at 20% 80%, #06b6d4 0px, transparent 50%), linear-gradient(180deg, #051124 0%, #02060f 100%)",
  },
  {
    id: "ember",
    label: "Ember",
    preview: "linear-gradient(135deg, #ef4444 0%, #f97316 50%, #facc15 100%)",
    bg: "radial-gradient(at 25% 25%, #ef4444 0px, transparent 50%), radial-gradient(at 75% 30%, #f97316 0px, transparent 55%), radial-gradient(at 50% 80%, #facc15 0px, transparent 45%), linear-gradient(135deg, #1a0606 0%, #240a0a 100%)",
  },
  {
    id: "mono",
    label: "Mono",
    preview: "linear-gradient(135deg, #2a2a2a 0%, #6b6b6b 50%, #d4d4d4 100%)",
    bg: "radial-gradient(at 30% 30%, #4a4a4a 0px, transparent 55%), radial-gradient(at 70% 70%, #2a2a2a 0px, transparent 55%), linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
  },
]

export function Wallpaper({ id, className }: { id: WallpaperId; className?: string }) {
  const wp = WALLPAPERS.find((w) => w.id === id) ?? WALLPAPERS[0]
  return (
    <div
      aria-hidden
      className={cn("absolute inset-0 transition-[background] duration-700", className)}
      style={{ background: wp.bg }}
    />
  )
}

export function WallpaperPicker({
  value,
  onChange,
}: {
  value: WallpaperId
  onChange: (id: WallpaperId) => void
}) {
  return (
    <div className="flex items-center gap-2" role="radiogroup" aria-label="Wallpaper">
      {WALLPAPERS.map((wp) => {
        const active = wp.id === value
        return (
          <button
            key={wp.id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={wp.label}
            title={wp.label}
            onClick={() => onChange(wp.id)}
            className={cn(
              "relative h-7 w-7 rounded-full ring-1 ring-white/15 transition-all duration-200",
              "hover:scale-110 hover:ring-white/40",
              active && "scale-110 ring-2 ring-primary",
            )}
            style={{ background: wp.preview }}
          >
            <span className="sr-only">{wp.label}</span>
          </button>
        )
      })}
    </div>
  )
}
