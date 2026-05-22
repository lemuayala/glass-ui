"use client"

import { useCallback, useEffect, useRef, useState } from "react"
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
  const stageRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [showBackdrop, setShowBackdrop] = useState(true)
  const [deviceFrame, setDeviceFrame] = useState<"iphone" | "ipad" | "none">("iphone")
  const dragStart = useRef<{ px: number; py: number; x: number; y: number } | null>(null)

  const toggleFrame = useCallback(() => {
    setDeviceFrame((f) => (f === "iphone" ? "ipad" : f === "ipad" ? "none" : "iphone"))
  }, [])
  const FrameIcon = deviceFrame === "iphone" ? Smartphone : deviceFrame === "ipad" ? Tablet : Monitor

  // Reset position whenever component changes — fresh stage per kind
  useEffect(() => {
    setPos({ x: 0, y: 0 })
  }, [component])

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
      {/* Stage */}
      <div ref={stageRef} className="relative flex-1 overflow-hidden bg-foreground/[0.02]">

        {/* Stage toolbar (top-right) - Outside the phone */}
        <div className="absolute right-4 top-4 z-30 flex items-center gap-1.5">
          <ToolbarBtn label={t("preview.toggleFrame") || "Toggle Device"} onClick={toggleFrame}>
            <FrameIcon className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            label={showBackdrop ? t("preview.toggleBackdrop.hide") : t("preview.toggleBackdrop.show")}
            onClick={() => setShowBackdrop((s) => !s)}
          >
            {showBackdrop ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          </ToolbarBtn>
          <ToolbarBtn
            label={t("preview.resetPosition")}
            onClick={() => setPos({ x: 0, y: 0 })}
            disabled={pos.x === 0 && pos.y === 0}
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </ToolbarBtn>
        </div>

        {/* Centered Device Frame */}
        <div className={cn(
          "absolute inset-0 flex items-center justify-center transition-all duration-500",
          deviceFrame === "none" ? "p-0" : "p-4 sm:p-6 lg:p-8"
        )}>
          <div className={cn(
            "relative flex h-full w-full flex-col overflow-hidden transition-all duration-500",
            deviceFrame === "iphone" && "max-h-[850px] max-w-[390px] rounded-[3rem] border-[4px] border-neutral-950 bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05),0_20px_40px_-10px_rgba(0,0,0,0.5)]",
            deviceFrame === "ipad" && "max-h-[800px] max-w-[550px] rounded-[2.5rem] border-[4px] border-neutral-950 bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05),0_20px_40px_-10px_rgba(0,0,0,0.5)]",
            deviceFrame === "none" && "max-h-full max-w-full rounded-none border-none bg-transparent shadow-none"
          )}>

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
                "relative z-10 flex h-full p-6",
                isBottomDocked ? "items-end justify-center pb-10" : "items-center justify-center",
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
                className={cn("select-none", isBottomDocked && "w-full max-w-[340px]")}
              >
                <ComponentStage component={component} options={options} />
              </div>
            </div>

            {/* Drag hint */}
            <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center">
              <div
                className={cn(
                  "flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-white/90 backdrop-blur-md transition-opacity duration-300",
                  dragging || pos.x !== 0 || pos.y !== 0 ? "opacity-0" : "opacity-100",
                )}
              >
                <Move className="h-3 w-3" />
                {t("preview.dragHint")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wallpaper picker bar */}
      <div className="flex items-center justify-between gap-3 border-t border-border bg-background/40 px-5 py-3 backdrop-blur-xl">
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

function ModalStage({ options }: { options: GlassOptions }) {
  const isDark = options.theme === "dark"
  const title = options.text || "Confirm action"
  return (
    <div className="w-[320px]">
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
    <label className="flex cursor-pointer items-center gap-3">
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
    <header className={cn(getGlassNavbarClasses(options), "w-[320px] max-w-full transition-all duration-300")}>
      <button type="button" className={cn("text-sm font-medium", muted)}>
        Back
      </button>
      <h1 className={cn("truncate text-base font-semibold", fg)}>{title}</h1>
      <button type="button" className={cn("text-sm font-medium", muted)}>
        Done
      </button>
    </header>
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
    <div className={cn(getGlassTabBarClasses(options), "transition-all duration-300")}>
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
      className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center px-6 pb-16 pt-20"
    >
      <div className="grid w-full max-w-[340px] grid-cols-4 gap-x-4 gap-y-6 opacity-95">
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
}: {
  children: React.ReactNode
  onClick: () => void
  label: string
  disabled?: boolean
}) {
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
              "flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white/85 backdrop-blur-md ring-1 ring-white/15 transition-all",
              "hover:bg-black/55 hover:text-white",
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
