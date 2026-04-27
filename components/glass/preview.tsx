"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Wallpaper, WallpaperPicker, type WallpaperId } from "./wallpaper"
import {
  getGlassCardClasses,
  getGlassButtonClasses,
  getGlassInputClasses,
} from "@/lib/glass-core/variants"
import type { ComponentKind, GlassOptions } from "@/lib/glass-core/types"
import {
  Bell,
  Music,
  Wifi,
  Battery,
  Search,
  Camera,
  Heart,
  Sparkles,
  Compass,
  Coffee,
  Palette,
  Sun,
  Cloud,
  Star,
  Move,
  RotateCcw,
  Eye,
  EyeOff,
} from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Live preview.
 *
 * Why we don't use react-native-web here:
 *  - The generated code uses *Tailwind utilities*, which render identically in
 *    the browser. Using RN-Web would add a heavy bridge with no visual gain
 *    for the utilities we expose. The generated code is still 100% valid
 *    React Native + NativeWind for export.
 *
 * Drag & drop:
 *  - The glass component can be dragged across the wallpaper using pointer
 *    events. This makes it obvious whether the chosen blur/intensity is
 *    actually transparent — the most common pitfall when designing glass UIs.
 */
export function Preview({
  options,
  component,
  wallpaper,
  onWallpaper,
}: {
  options: GlassOptions
  component: ComponentKind
  wallpaper: WallpaperId
  onWallpaper: (id: WallpaperId) => void
}) {
  const stageRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [showBackdrop, setShowBackdrop] = useState(true)
  const dragStart = useRef<{ px: number; py: number; x: number; y: number } | null>(null)

  // Reset position whenever component changes — fresh stage per kind
  useEffect(() => {
    setPos({ x: 0, y: 0 })
  }, [component])

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault()
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
      dragStart.current = { px: e.clientX, py: e.clientY, x: pos.x, y: pos.y }
      setDragging(true)
    },
    [pos.x, pos.y],
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragStart.current || !stageRef.current) return
      const stage = stageRef.current.getBoundingClientRect()
      const dx = e.clientX - dragStart.current.px
      const dy = e.clientY - dragStart.current.py
      // Clamp inside stage bounds with a 24px safe area
      const maxX = stage.width / 2 - 60
      const maxY = stage.height / 2 - 60
      const nextX = Math.max(-maxX, Math.min(maxX, dragStart.current.x + dx))
      const nextY = Math.max(-maxY, Math.min(maxY, dragStart.current.y + dy))
      setPos({ x: nextX, y: nextY })
    },
    [],
  )

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    dragStart.current = null
    setDragging(false)
    try {
      ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {}
  }, [])

  return (
    <div className="flex h-full flex-col">
      {/* Stage */}
      <div ref={stageRef} className="relative flex-1 overflow-hidden">
        <Wallpaper id={wallpaper} />

        {/* Backdrop content — gives the glass something to occlude */}
        {showBackdrop && <BackdropGrid />}

        {/* Mock iOS status bar */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-3 text-xs font-semibold text-white/95 mix-blend-luminosity">
          <span className="tabular-nums">9:41</span>
          <div className="flex items-center gap-1.5">
            <Wifi className="h-3.5 w-3.5" />
            <Battery className="h-4 w-4" />
          </div>
        </div>

        {/* Stage toolbar (top-right) */}
        <div className="absolute right-3 top-10 z-20 flex items-center gap-1.5">
          <ToolbarBtn
            label={showBackdrop ? "Hide backdrop content" : "Show backdrop content"}
            onClick={() => setShowBackdrop((s) => !s)}
          >
            {showBackdrop ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          </ToolbarBtn>
          <ToolbarBtn
            label="Reset position"
            onClick={() => setPos({ x: 0, y: 0 })}
            disabled={pos.x === 0 && pos.y === 0}
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </ToolbarBtn>
        </div>

        {/* Draggable surface */}
        <div className="relative z-10 flex h-full items-center justify-center p-6">
          <div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            style={{
              transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
              transition: dragging ? "none" : "transform 250ms cubic-bezier(0.22, 1, 0.36, 1)",
              cursor: dragging ? "grabbing" : "grab",
              touchAction: "none",
            }}
            className={cn(
              "select-none",
              dragging && "scale-[1.02] drop-shadow-[0_30px_60px_rgba(0,0,0,0.45)]",
            )}
          >
            <ComponentStage component={component} options={options} />
          </div>
        </div>

        {/* Drag hint */}
        <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex justify-center">
          <div
            className={cn(
              "flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-white/80 backdrop-blur-md transition-opacity duration-300",
              dragging || pos.x !== 0 || pos.y !== 0 ? "opacity-0" : "opacity-100",
            )}
          >
            <Move className="h-3 w-3" />
            Drag to test transparency
          </div>
        </div>
      </div>

      {/* Wallpaper picker bar */}
      <div className="flex items-center justify-between gap-3 border-t border-white/5 bg-background/40 px-5 py-3 backdrop-blur-xl">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Wallpaper
        </span>
        <WallpaperPicker value={wallpaper} onChange={onWallpaper} />
      </div>
    </div>
  )
}

/* -----------------------------------------------------------
 * Component-specific stages
 * --------------------------------------------------------- */
function ComponentStage({
  component,
  options,
}: {
  component: ComponentKind
  options: GlassOptions
}) {
  if (component === "glass-card") return <CardStage options={options} />
  if (component === "glass-button") return <ButtonStage options={options} />
  if (component === "glass-input") return <InputStage options={options} />
  return null
}

function CardStage({ options }: { options: GlassOptions }) {
  const isDark = options.theme === "dark"
  return (
    <div className="w-[300px]">
      <div className={cn(getGlassCardClasses(options), "transition-all duration-300")}>
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
            <div className={cn("h-full w-2/5 rounded-full", isDark ? "bg-white/80" : "bg-neutral-900/80")} />
          </div>
          <span className={cn("text-[10px] tabular-nums", isDark ? "text-white/60" : "text-neutral-700/70")}>
            1:24 / 3:45
          </span>
        </div>
      </div>
    </div>
  )
}

function ButtonStage({ options }: { options: GlassOptions }) {
  const label = options.text || "Continue"
  return (
    <div className={cn(getGlassButtonClasses(options), "transition-all duration-300")}>
      <Sparkles className="mr-2 h-4 w-4" strokeWidth={2.5} />
      {label}
    </div>
  )
}

function InputStage({ options }: { options: GlassOptions }) {
  const placeholder = options.text || "Search…"
  const isDark = options.theme === "dark"
  return (
    <div className="w-[300px]">
      <div className={cn(getGlassInputClasses(options), "flex items-center gap-2 transition-all duration-300")}>
        <Search className={cn("h-4 w-4 shrink-0", isDark ? "text-white/60" : "text-neutral-700/70")} />
        <span className={cn(isDark ? "text-white/55" : "text-neutral-700/60")}>{placeholder}</span>
      </div>
    </div>
  )
}

/* -----------------------------------------------------------
 * Backdrop content — visual elements behind the glass.
 * The whole point: when dragging, the user can see exactly
 * how the chosen blur/intensity affects readability.
 * --------------------------------------------------------- */
function BackdropGrid() {
  const items = [
    { Icon: Camera, label: "Photos" },
    { Icon: Heart, label: "Loved" },
    { Icon: Compass, label: "Maps" },
    { Icon: Coffee, label: "Cafés" },
    { Icon: Palette, label: "Art" },
    { Icon: Sun, label: "Weather" },
    { Icon: Cloud, label: "Cloud" },
    { Icon: Star, label: "Stars" },
    { Icon: Music, label: "Music" },
    { Icon: Bell, label: "Alerts" },
    { Icon: Search, label: "Search" },
    { Icon: Sparkles, label: "Magic" },
  ]
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center px-6 pb-16 pt-20"
    >
      <div className="grid w-full max-w-[340px] grid-cols-4 gap-x-4 gap-y-5 opacity-90">
        {items.map(({ Icon, label }, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3)] ring-1 ring-white/10 backdrop-blur-sm">
              <Icon className="h-6 w-6 text-white" strokeWidth={2} />
            </div>
            <span className="text-[10px] font-medium text-white/85 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ToolbarBtn({
  children,
  onClick,
  label,
  disabled,
}: {
  children: React.ReactNode
  onClick: () => void
  label: string
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      disabled={disabled}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white/85 backdrop-blur-md ring-1 ring-white/15 transition-all",
        "hover:bg-black/55 hover:text-white",
        "disabled:cursor-not-allowed disabled:opacity-40",
      )}
    >
      {children}
    </button>
  )
}
