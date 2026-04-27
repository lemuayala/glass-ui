"use client"

import { Wallpaper, WallpaperPicker, type WallpaperId } from "./wallpaper"
import { getGlassCardClasses } from "@/lib/glass-core/variants"
import type { GlassOptions } from "@/lib/glass-core/types"
import { Bell, Music, Wifi, Battery } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Live preview of the GlassCard.
 *
 * Notes:
 * • The preview uses regular DOM nodes (not react-native-web) but applies the
 *   exact same Tailwind classes that the generated React Native + NativeWind
 *   code will produce. The visual fidelity is identical for the utilities we
 *   support, and the experience is faster (no RN-Web bridge needed).
 * • The classes come from `getGlassCardClasses` — the single source of truth
 *   shared with the codegen.
 */
export function Preview({
  options,
  wallpaper,
  onWallpaper,
}: {
  options: GlassOptions
  wallpaper: WallpaperId
  onWallpaper: (id: WallpaperId) => void
}) {
  const cardClasses = getGlassCardClasses(options)
  const isDark = options.theme === "dark"

  return (
    <div className="flex h-full flex-col">
      {/* Stage */}
      <div className="relative flex-1 overflow-hidden">
        <Wallpaper id={wallpaper} />

        {/* Mock iOS status bar — sells the “real device” feeling */}
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 py-3 text-xs font-semibold text-white/90">
          <span className="tabular-nums">9:41</span>
          <div className="flex items-center gap-1.5">
            <Wifi className="h-3.5 w-3.5" />
            <Battery className="h-4 w-4" />
          </div>
        </div>

        {/* Centered glass card */}
        <div className="relative z-0 flex h-full items-center justify-center p-6">
          <div className="w-full max-w-sm">
            <div className={cn(cardClasses, "transition-all duration-300")}>
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                    isDark ? "bg-white/10" : "bg-black/10",
                  )}
                >
                  <Music className={cn("h-5 w-5", isDark ? "text-white" : "text-neutral-900")} />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "text-base font-semibold leading-tight",
                      isDark ? "text-white" : "text-neutral-900",
                    )}
                  >
                    Now Playing
                  </p>
                  <p className={cn("mt-0.5 text-sm leading-snug", isDark ? "text-white/70" : "text-neutral-700")}>
                    Frosted vibes — Glass UI
                  </p>
                </div>
                <Bell className={cn("h-4 w-4 shrink-0", isDark ? "text-white/60" : "text-neutral-700/70")} />
              </div>

              <div className="mt-4 flex items-center gap-2">
                <div className={cn("h-1 flex-1 overflow-hidden rounded-full", isDark ? "bg-white/15" : "bg-black/15")}>
                  <div
                    className={cn("h-full w-2/5 rounded-full", isDark ? "bg-white/80" : "bg-neutral-900/80")}
                  />
                </div>
                <span className={cn("text-[10px] tabular-nums", isDark ? "text-white/60" : "text-neutral-700/70")}>
                  1:24 / 3:45
                </span>
              </div>
            </div>

            {/* Caption */}
            <p className="mt-4 text-center text-[11px] font-medium uppercase tracking-wider text-white/60">
              Live preview · {options.theme} · blur {options.blur} · {options.rounded}
            </p>
          </div>
        </div>
      </div>

      {/* Wallpaper picker bar */}
      <div className="flex items-center justify-between gap-3 border-t border-white/5 bg-background/40 px-5 py-3 backdrop-blur-xl">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Wallpaper</span>
        <WallpaperPicker value={wallpaper} onChange={onWallpaper} />
      </div>
    </div>
  )
}
