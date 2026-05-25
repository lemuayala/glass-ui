"use client"

import { useEffect } from "react"
import { ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { useT } from "@/lib/i18n/provider"

const THRESHOLD = 520

export function ScrollToTop() {
  const t = useT()

  useEffect(() => {
    let raf = 0
    const root = document.documentElement

    const sync = () => {
      raf = 0
      const on = window.scrollY > THRESHOLD
      root.dataset.scrollTop = on ? "1" : "0"
    }

    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(sync)
    }

    sync()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (raf) cancelAnimationFrame(raf)
      delete root.dataset.scrollTop
    }
  }, [])

  return (
    <button
      type="button"
      aria-label={t("actions.scrollTop")}
      title={t("actions.scrollTop")}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "gg-scroll-top fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full",
        "border border-white/10 bg-background/90 text-foreground shadow-lg",
        "max-md:backdrop-blur-none md:bg-black/50 md:text-white/90 md:backdrop-blur-xl",
        "transition-[opacity,transform] duration-300 hover:bg-background md:hover:bg-black/70 md:hover:text-white",
      )}
    >
      <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
    </button>
  )
}
