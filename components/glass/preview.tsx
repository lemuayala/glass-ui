"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { animate, utils } from "animejs"
import { Wallpaper, WallpaperPicker, type WallpaperId } from "./wallpaper"
import {
  getGlassCardClasses,
  getGlassButtonClasses,
  getGlassInputClasses,
  getGlassModalClasses,
  getGlassTabBarClasses,
  getGlassSwitchClasses,
  getGlassNavbarClasses,
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
  Home,
  User,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react"
import {
  IosBattery,
  IosBell,
  IosCamera,
  IosCellular,
  IosCloud,
  IosCoffee,
  IosCompass,
  IosHeart,
  IosHome,
  IosMusic,
  IosPalette,
  IosPhotos,
  IosSearch,
  IosSparkles,
  IosStar,
  IosUser,
  IosWeather,
  IosWifi,
} from "./ios-icons"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useT } from "@/lib/i18n/provider"
import { prefersReducedMotion } from "@/lib/landing-motion"
import { PREVIEW_DEVICE_FRAMES, type PreviewDeviceFrame } from "@/lib/device-frame"
import { useIsMobile } from "@/hooks/use-mobile"

/**
 * Live preview.
 *
 * Drag & drop:
 *  - The glass component can be dragged across the wallpaper using pointer
 *    events. While dragging we DO NOT alter the component's visual style
 *    (no scale, no extra shadow) — that way the user sees the *exact same*
 *    blur/transparency they'll get in production. Only the cursor changes.
 */
export function Preview({
  options,
  component,
  wallpaper,
  customWallpaper,
  onWallpaper,
  onCustomUpload,
  onCustomClear,
}: {
  options: GlassOptions
  component: ComponentKind
  wallpaper: WallpaperId
  customWallpaper: string | null
  onWallpaper: (id: WallpaperId) => void
  onCustomUpload: (dataUrl: string) => void
  onCustomClear: () => void
}) {
  const t = useT()
  const isMobile = useIsMobile()
  const stageRef = useRef<HTMLDivElement>(null)
  const deviceShellRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [showBackdrop, setShowBackdrop] = useState(false)
  const [deviceFrame, setDeviceFrame] = useState<PreviewDeviceFrame>("none")

  useEffect(() => {
    if (isMobile) {
      setShowBackdrop(false)
      setDeviceFrame("none")
      return
    }
    setShowBackdrop(true)
    setDeviceFrame((prev) => (prev === "none" ? "iphone" : prev))
  }, [isMobile])
  const deviceSpec = deviceFrame !== "none" ? PREVIEW_DEVICE_FRAMES[deviceFrame] : null
  const dragStart = useRef<{ px: number; py: number; x: number; y: number } | null>(null)

  const selectFrame = useCallback((frame: PreviewDeviceFrame) => {
    setDeviceFrame(frame)
  }, [])

  // Reset drag when component or device shell changes
  useEffect(() => {
    setPos({ x: 0, y: 0 })
  }, [component, deviceFrame])

  // Grow / morph animation when switching iPhone ↔ iPad ↔ full
  useEffect(() => {
    const shell = deviceShellRef.current
    if (!shell) return

    if (prefersReducedMotion()) {
      utils.set(shell, { scale: 1, opacity: 1 })
      return
    }

    utils.set(shell, { scale: 0.9, opacity: 0.62 })
    const anim = animate(shell, {
      scale: [0.9, 1],
      opacity: [0.62, 1],
      duration: 560,
      ease: "out(4)",
    })
    return () => {
      anim.pause()
    }
  }, [deviceFrame])

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault()
        ; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
      dragStart.current = { px: e.clientX, py: e.clientY, x: pos.x, y: pos.y }
      setDragging(true)
    },
    [pos.x, pos.y],
  )

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStart.current || !stageRef.current) return
    const stage = stageRef.current.getBoundingClientRect()
    const dx = e.clientX - dragStart.current.px
    const dy = e.clientY - dragStart.current.py
    const maxX = stage.width / 2 - 60
    const maxY = stage.height / 2 - 60
    const nextX = Math.max(-maxX, Math.min(maxX, dragStart.current.x + dx))
    const nextY = Math.max(-maxY, Math.min(maxY, dragStart.current.y + dy))
    setPos({ x: nextX, y: nextY })
  }, [])

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    dragStart.current = null
    setDragging(false)
    try {
      ; (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    } catch { }
  }, [])

  // For the tab bar we anchor it to the bottom of the stage and only allow
  // horizontal drag — that mirrors how it actually behaves in iOS apps.
  const isBottomDocked = component === "glass-tabbar"

  return (
    <div className="flex h-full flex-col">
      {/* Chrome bar — outside device frame so pills never overlap the shell */}
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border/60 bg-background/90 px-2 py-2 backdrop-blur-none max-lg:bg-background/90 lg:bg-background/55 lg:backdrop-blur-md sm:px-3">
        <div className="flex min-w-0 flex-1 items-center gap-1">
          {(
            [
              { id: "iphone" as const, label: "iPhone", Icon: Smartphone },
              { id: "ipad" as const, label: "iPad", Icon: Tablet },
              { id: "none" as const, label: "Full", Icon: Monitor },
            ] as const
          ).map(({ id, label, Icon }) => {
            const active = deviceFrame === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => selectFrame(id)}
                aria-pressed={active}
                aria-label={label}
                className={cn(
                  "flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-medium transition-all duration-200 sm:px-2.5 sm:py-1.5 sm:text-[11px]",
                  active
                    ? "border-foreground/20 bg-foreground/15 text-foreground shadow-sm"
                    : "border-border/80 bg-foreground/[0.04] text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground",
                )}
              >
                <Icon className="h-3 w-3 shrink-0" strokeWidth={2.2} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            )
          })}
        </div>
        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
          <ToolbarBtn
            label={showBackdrop ? t("preview.toggleBackdrop.hide") : t("preview.toggleBackdrop.show")}
            onClick={() => setShowBackdrop((s) => !s)}
            variant="chrome"
          >
            {showBackdrop ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          </ToolbarBtn>
          <ToolbarBtn
            label={t("preview.resetPosition")}
            onClick={() => setPos({ x: 0, y: 0 })}
            disabled={pos.x === 0 && pos.y === 0}
            variant="chrome"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </ToolbarBtn>
        </div>
      </div>

      {/* Stage */}
      <div
        ref={stageRef}
        className="gg-preview-stage relative min-h-0 flex-1 overflow-hidden bg-foreground/[0.02]"
      >
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            deviceFrame === "none" ? "p-0" : "p-2 max-lg:p-2 sm:p-5 lg:p-8",
          )}
        >
          <div
            ref={deviceShellRef}
            className={cn(
              "gg-preview-device-shell relative flex min-h-0 min-w-0 flex-col overflow-hidden",
              deviceFrame === "none" &&
                "h-full w-full rounded-none border-none bg-transparent shadow-none",
              deviceFrame !== "none" &&
                deviceSpec &&
                "h-full w-auto max-w-full border-[4px] border-neutral-950 bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05),0_20px_40px_-10px_rgba(0,0,0,0.5)]",
            )}
            style={
              deviceSpec
                ? {
                    aspectRatio: `${deviceSpec.width} / ${deviceSpec.height}`,
                    maxHeight: "100%",
                    maxWidth: `min(100%, ${deviceSpec.width}px)`,
                    borderRadius: deviceSpec.radius,
                  }
                : undefined
            }
          >

            {/* Dynamic Island (iPhone only) */}
            {deviceFrame === "iphone" && (
              <div className="absolute left-1/2 top-3 z-50 flex h-[24px] w-[84px] -translate-x-1/2 items-center justify-end rounded-full bg-black px-2.5 shadow-[inset_0_0_2px_rgba(255,255,255,0.15)]">
                <div className="h-2 w-2 rounded-full bg-white/10" />
              </div>
            )}

            {/* Front Camera (iPad only) */}
            {deviceFrame === "ipad" && (
              <div className="absolute left-1/2 top-2 z-50 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white/15 shadow-[inset_0_0_2px_rgba(255,255,255,0.2)]" />
            )}

            <Wallpaper id={wallpaper} customUrl={customWallpaper} />

            {/* Backdrop content */}
            {showBackdrop && <BackdropGrid />}

            {/* Mock iOS status bar */}
            {deviceFrame !== "none" && (
              <div className={cn(
                "pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between font-semibold text-white/95 mix-blend-luminosity",
                deviceFrame === "iphone" ? "px-7 py-3 text-[11px]" : "px-6 py-2.5 text-[10px]"
              )}>
                <span className="tabular-nums">{deviceFrame === "ipad" ? "9:41 AM" : "9:41"}</span>
                <div className="flex items-center gap-1.5">
                  {deviceFrame === "iphone" && <IosCellular className="h-3 w-3" />}
                  <IosWifi className="h-3 w-3" />
                  <IosBattery className="h-4 w-4" />
                </div>
              </div>
            )}

            {/* Draggable surface — visual is identical whether dragging or not */}
            <div
              className={cn(
                "gg-preview-drag-surface relative z-10 flex h-full w-full min-w-0",
                isBottomDocked ? "items-end justify-center pb-8 sm:pb-10" : "items-center justify-center",
              )}
            >
              <div
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                style={{
                  transform: `translate3d(${pos.x}px, ${isBottomDocked ? 0 : pos.y}px, 0)`,
                  transition: dragging ? "none" : "transform 250ms cubic-bezier(0.22, 1, 0.36, 1)",
                  cursor: dragging ? "grabbing" : "grab",
                  touchAction: "none",
                }}
                className="mx-auto flex w-full min-w-0 max-w-full justify-center select-none"
              >
                <ComponentStage component={component} options={options} />
              </div>
            </div>

            {/* Drag hint */}
            <div className="gg-preview-drag-hint pointer-events-none absolute inset-x-0 bottom-4 z-20 flex justify-center sm:bottom-6">
              <div
                className={cn(
                  "flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-white/90 backdrop-blur-md transition-opacity duration-300",
                  dragging || pos.x !== 0 || pos.y !== 0 ? "opacity-0" : "opacity-100",
                )}
              >
                <Move className="h-3 w-3" />
                <span className="gg-preview-drag-hint-text">{t("preview.dragHint")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wallpaper picker bar */}
      <div className="flex shrink-0 flex-col gap-2 border-t border-border bg-background/90 px-3 py-2.5 backdrop-blur-none max-lg:bg-background/90 lg:bg-background/40 lg:backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-5 sm:py-3">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {t("preview.wallpaper")}
        </span>
        <WallpaperPicker
          value={wallpaper}
          customUrl={customWallpaper}
          onChange={onWallpaper}
          onCustomUpload={onCustomUpload}
          onCustomClear={onCustomClear}
        />
      </div>
    </div>
  )
}

/* -----------------------------------------------------------
 * Component-specific stages
 * --------------------------------------------------------- */
function CardStage({ options }: { options: GlassOptions }) {
  const isDark = options.theme === "dark"
  const title = options.text || "Now Playing"
  return (
    <div className="gg-preview-primitive">
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
                "truncate text-base font-semibold leading-tight",
                isDark ? "text-white" : "text-neutral-900",
              )}
            >
              {title}
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
    <div className="flex justify-center">
      <div className={cn(getGlassButtonClasses(options), "transition-all duration-300")}>
        <Sparkles className="mr-2 h-4 w-4" strokeWidth={2.5} />
        {label}
      </div>
    </div>
  )
}

function InputStage({ options }: { options: GlassOptions }) {
  const placeholder = options.text || "Search…"
  const isDark = options.theme === "dark"
  return (
    <div className="gg-preview-primitive-input">
      <div className={cn(getGlassInputClasses(options), "flex min-w-0 items-center gap-2 transition-all duration-300")}>
        <Search className={cn("h-4 w-4 shrink-0", isDark ? "text-white/60" : "text-neutral-700/70")} />
        <span className={cn("min-w-0 flex-1 truncate", isDark ? "text-white/55" : "text-neutral-700/60")}>
          {placeholder}
        </span>
      </div>
    </div>
  )
}

function ModalStage({ options }: { options: GlassOptions }) {
  const isDark = options.theme === "dark"
  const title = options.text || "Confirm action"
  return (
    <div className="gg-preview-primitive">
      <div className={cn(getGlassModalClasses(options), "transition-all duration-300")}>
        <p className={cn("text-base font-semibold tracking-tight", isDark ? "text-white" : "text-neutral-900")}>
          {title}
        </p>
        <p className={cn("mt-1.5 text-sm leading-relaxed", isDark ? "text-white/70" : "text-neutral-700")}>
          This action can be undone from the settings panel.
        </p>
        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            className={cn(
              "h-9 rounded-full px-4 text-xs font-medium transition-colors",
              isDark ? "text-white/80 hover:bg-white/10" : "text-neutral-700 hover:bg-black/5",
            )}
          >
            Cancel
          </button>
          <button
            type="button"
            className="h-9 rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-md transition-colors hover:bg-primary/90"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

function SwitchStage({ options }: { options: GlassOptions }) {
  const label = options.text || "Notifications"
  const isDark = options.theme === "dark"
  const [on, setOn] = useState(true)
  const thumbOn = isDark ? "translate-x-6 bg-white" : "translate-x-6 bg-neutral-900"
  const thumbOff = isDark ? "translate-x-0.5 bg-white/70" : "translate-x-0.5 bg-neutral-600"

  return (
    <label className="mx-auto flex w-fit cursor-pointer items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => setOn((v) => !v)}
        className={cn(getGlassSwitchClasses(options), "relative transition-all duration-300")}
      >
        <span
          className={cn(
            "block h-6 w-6 rounded-full shadow-sm transition-transform",
            on ? thumbOn : thumbOff,
          )}
        />
      </button>
      <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-neutral-900")}>{label}</span>
    </label>
  )
}

function NavbarStage({ options }: { options: GlassOptions }) {
  const title = options.text || "Glass UI"
  const isDark = options.theme === "dark"
  const fg = isDark ? "text-white" : "text-neutral-900"
  const muted = isDark ? "text-white/60" : "text-neutral-600"

  return (
    <div className="gg-preview-primitive-bar">
      <header
        className={cn(
          getGlassNavbarClasses(options),
          "grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 transition-all duration-300",
        )}
      >
      <button type="button" className={cn("shrink-0 text-sm font-medium", muted)}>
        Back
      </button>
      <h1 className={cn("truncate text-center text-base font-semibold", fg)}>{title}</h1>
      <button type="button" className={cn("shrink-0 text-sm font-medium", muted)}>
        Done
      </button>
      </header>
    </div>
  )
}

function TabBarStage({ options }: { options: GlassOptions }) {
  const isDark = options.theme === "dark"
  const tabs = [
    { id: "home", Icon: IosHome, label: "Home" },
    { id: "search", Icon: IosSearch, label: "Search" },
    { id: "saved", Icon: IosHeart, label: "Saved" },
    { id: "profile", Icon: IosUser, label: "Profile" },
  ]
  const [active, setActive] = useState("home")
  return (
    <div className="gg-preview-primitive-dock">
      <div className={cn(getGlassTabBarClasses(options), "flex w-full min-w-0 transition-all duration-300")}>
      {tabs.map(({ id, Icon, label }) => {
        const isActive = id === active
        return (
          <button
            key={id}
            type="button"
            onClick={() => setActive(id)}
            className="flex flex-1 flex-col items-center justify-center gap-0.5"
          >
            <Icon
              className={cn(
                "h-5 w-5 transition-colors",
                isActive
                  ? isDark
                    ? "text-white"
                    : "text-neutral-900"
                  : isDark
                    ? "text-white/55"
                    : "text-neutral-700/55",
              )}
              strokeWidth={2.2}
            />
            <span
              className={cn(
                "text-[10px] font-medium tracking-tight transition-colors",
                isActive
                  ? isDark
                    ? "text-white"
                    : "text-neutral-900"
                  : isDark
                    ? "text-white/55"
                    : "text-neutral-700/55",
              )}
            >
              {label}
            </span>
          </button>
        )
      })}
      </div>
    </div>
  )
}

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
  if (component === "glass-modal") return <ModalStage options={options} />
  if (component === "glass-tabbar") return <TabBarStage options={options} />
  if (component === "glass-switch") return <SwitchStage options={options} />
  if (component === "glass-navbar") return <NavbarStage options={options} />
  return null
}

/* -----------------------------------------------------------
 * Backdrop content — visual elements behind the glass.
 * --------------------------------------------------------- */
function BackdropGrid() {
  const items = [
    { Icon: IosPhotos, label: "Photos", bg: "bg-gradient-to-b from-white to-neutral-200", fg: "text-neutral-900" },
    { Icon: IosHeart, label: "Loved", bg: "bg-gradient-to-b from-rose-400 to-rose-600", fg: "text-white" },
    { Icon: IosCompass, label: "Maps", bg: "bg-gradient-to-b from-emerald-400 to-emerald-600", fg: "text-white" },
    { Icon: IosCoffee, label: "Cafés", bg: "bg-gradient-to-b from-orange-400 to-amber-600", fg: "text-white" },
    { Icon: IosPalette, label: "Art", bg: "bg-gradient-to-b from-indigo-500 to-purple-600", fg: "text-white" },
    { Icon: IosWeather, label: "Weather", bg: "bg-gradient-to-b from-sky-400 to-blue-600", fg: "text-white" },
    { Icon: IosCloud, label: "Cloud", bg: "bg-gradient-to-b from-cyan-300 to-blue-500", fg: "text-white" },
    { Icon: IosStar, label: "Stars", bg: "bg-gradient-to-b from-yellow-400 to-orange-500", fg: "text-white" },
    { Icon: IosMusic, label: "Music", bg: "bg-gradient-to-b from-pink-500 to-rose-500", fg: "text-white" },
    { Icon: IosBell, label: "Alerts", bg: "bg-gradient-to-b from-red-500 to-red-600", fg: "text-white" },
    { Icon: IosSearch, label: "Search", bg: "bg-gradient-to-b from-neutral-600 to-neutral-800", fg: "text-white" },
    { Icon: IosSparkles, label: "Magic", bg: "bg-gradient-to-b from-violet-500 to-fuchsia-600", fg: "text-white" },
  ]
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center px-4 pb-14 pt-16 sm:px-6 sm:pb-16 sm:pt-20"
    >
      <div className="grid w-full max-w-full min-w-0 grid-cols-4 gap-x-3 gap-y-5 opacity-95 sm:gap-x-4 sm:gap-y-6">
        {items.map(({ Icon, label, bg, fg }, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <div className={cn(
              "flex h-14 w-14 items-center justify-center rounded-[1.25rem] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3),0_4px_10px_-2px_rgba(0,0,0,0.3)] ring-1 ring-black/10",
              bg, fg
            )}>
              <Icon className="h-7 w-7" strokeWidth={2} />
            </div>
            <span className="text-[10px] font-medium text-white/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
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
  variant = "overlay",
}: {
  children: React.ReactNode
  onClick: () => void
  label: string
  disabled?: boolean
  variant?: "overlay" | "chrome"
}) {
  const isChrome = variant === "chrome"
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={onClick}
            aria-label={label}
            disabled={disabled}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full transition-all",
              isChrome
                ? "border border-border bg-foreground/[0.04] text-muted-foreground hover:bg-foreground/[0.08] hover:text-foreground"
                : "bg-black/40 text-white/85 backdrop-blur-md ring-1 ring-white/15 hover:bg-black/55 hover:text-white",
              "disabled:cursor-not-allowed disabled:opacity-40",
            )}
          >
            {children}
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={6}>
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
