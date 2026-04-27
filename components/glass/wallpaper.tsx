"use client"

import { useRef } from "react"
import { Upload, X } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useT } from "@/lib/i18n/provider"

export type WallpaperId = "sunset" | "aurora" | "ocean" | "ember" | "mono" | "custom"

export const WALLPAPERS: { id: Exclude<WallpaperId, "custom">; label: string; preview: string; bg: string }[] = [
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

const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

/**
 * Renders the active wallpaper. When `id === "custom"` and a `customUrl` is
 * provided, it renders the user's image with cover sizing instead.
 */
export function Wallpaper({
  id,
  customUrl,
  className,
}: {
  id: WallpaperId
  customUrl?: string | null
  className?: string
}) {
  if (id === "custom" && customUrl) {
    return (
      <div
        aria-hidden
        className={cn("absolute inset-0 transition-[background] duration-700", className)}
        style={{
          backgroundImage: `url("${customUrl}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    )
  }
  const safeId = id === "custom" ? "aurora" : id
  const wp = WALLPAPERS.find((w) => w.id === safeId) ?? WALLPAPERS[0]
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
  customUrl,
  onChange,
  onCustomUpload,
  onCustomClear,
}: {
  value: WallpaperId
  customUrl: string | null
  onChange: (id: WallpaperId) => void
  onCustomUpload: (dataUrl: string) => void
  onCustomClear: () => void
}) {
  const t = useT()
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (file.size > MAX_SIZE_BYTES) {
      toast.error(t("preview.wallpaper.tooLarge"))
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result === "string") {
        onCustomUpload(result)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex items-center gap-2" role="radiogroup" aria-label={t("preview.wallpaper")}>
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

      {/* Custom wallpaper slot */}
      {customUrl ? (
        <div className="relative">
          <button
            type="button"
            role="radio"
            aria-checked={value === "custom"}
            aria-label="Custom wallpaper"
            title="Custom wallpaper"
            onClick={() => onChange("custom")}
            className={cn(
              "relative h-7 w-7 overflow-hidden rounded-full ring-1 ring-white/15 transition-all duration-200",
              "hover:scale-110 hover:ring-white/40",
              value === "custom" && "scale-110 ring-2 ring-primary",
            )}
            style={{
              backgroundImage: `url("${customUrl}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <span className="sr-only">Custom wallpaper</span>
          </button>
          <button
            type="button"
            onClick={onCustomClear}
            aria-label="Remove custom wallpaper"
            className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-foreground text-background shadow-md ring-2 ring-background transition-transform hover:scale-110"
          >
            <X className="h-2 w-2" strokeWidth={3} />
          </button>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        aria-label={t("preview.wallpaper.upload")}
        title={t("preview.wallpaper.upload")}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full",
          "border border-dashed border-foreground/20 text-muted-foreground",
          "hover:border-foreground/40 hover:bg-foreground/5 hover:text-foreground",
          "transition-colors",
        )}
      >
        <Upload className="h-3 w-3" strokeWidth={2.5} />
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = "" // allow same-file re-selection
        }}
      />
    </div>
  )
}
