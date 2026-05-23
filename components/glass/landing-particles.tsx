"use client"

import { useEffect, useRef } from "react"
import { prefersReducedMotion } from "@/lib/landing-motion"

type Dust = {
  kind: "dust" | "star"
  x: number
  y: number
  vx: number
  vy: number
  size: number
  rot: number
  hue: number
  alpha: number
  phase: number
}

const HUES = [248, 198, 285]

function hsla(h: number, a: number) {
  return `hsla(${h}, 78%, 88%, ${a})`
}

function drawStar(ctx: CanvasRenderingContext2D, p: Dust, a: number) {
  const r = p.size
  ctx.save()
  ctx.translate(p.x, p.y)
  ctx.rotate(p.rot)
  ctx.strokeStyle = hsla(p.hue, a)
  ctx.lineWidth = 0.7
  ctx.lineCap = "round"
  ctx.beginPath()
  ctx.moveTo(-r, 0)
  ctx.lineTo(r, 0)
  ctx.moveTo(0, -r)
  ctx.lineTo(0, r)
  ctx.stroke()
  ctx.restore()
}

function drawDust(ctx: CanvasRenderingContext2D, p: Dust, a: number) {
  ctx.beginPath()
  ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
  ctx.fillStyle = hsla(p.hue, a)
  ctx.fill()
}

/**
 * Star-dust for #inicio — tiny points + fine crosses, no blob circles.
 */
export function LandingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Dust[]>([])
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const reduced = prefersReducedMotion()
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const parent = canvas.parentElement
    if (!parent) return

    const resize = () => {
      const { width, height } = parent.getBoundingClientRect()
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const init = (w: number, h: number) => {
      const count = Math.min(24, Math.max(12, Math.floor((w * h) / 65000)))
      const starSlots = Math.max(3, Math.floor(count * 0.35))

      particlesRef.current = Array.from({ length: count }, (_, i) => {
        const isStar = i < starSlots
        const hue = HUES[Math.floor(Math.random() * HUES.length)]!
        return {
          kind: isStar ? "star" : "dust",
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.045,
          vy: (Math.random() - 0.5) * 0.038 - 0.015,
          size: isStar ? 1.8 + Math.random() * 1.6 : 0.75 + Math.random() * 0.55,
          rot: Math.random() * Math.PI,
          hue: hue + (Math.random() - 0.5) * 12,
          alpha: isStar ? 0.22 + Math.random() * 0.22 : 0.1 + Math.random() * 0.14,
          phase: Math.random() * Math.PI * 2,
        }
      })
    }

    resize()
    const rect = parent.getBoundingClientRect()
    init(rect.width, rect.height)

    const ro = new ResizeObserver(() => {
      resize()
      const r = parent.getBoundingClientRect()
      init(r.width, r.height)
    })
    ro.observe(parent)

    const paint = (time = 0, animate: boolean) => {
      const w = parent.clientWidth
      const h = parent.clientHeight
      ctx.clearRect(0, 0, w, h)

      for (const p of particlesRef.current) {
        if (animate) {
          p.x += p.vx
          p.y += p.vy
          if (p.x < 0) p.x = w
          if (p.x > w) p.x = 0
          if (p.y < 0) p.y = h
          if (p.y > h) p.y = 0
        }

        const pulse =
          p.kind === "star"
            ? 0.65 + 0.35 * Math.sin(time * 0.0009 + p.phase)
            : 0.85 + 0.15 * Math.sin(time * 0.0005 + p.phase)
        const a = p.alpha * pulse

        if (p.kind === "star") drawStar(ctx, p, a)
        else drawDust(ctx, p, a)
      }
    }

    if (reduced) {
      paint(0, false)
      return () => ro.disconnect()
    }

    const tick = (time: number) => {
      paint(time, true)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      ro.disconnect()
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] opacity-[0.42] dark:opacity-[0.5] dark:mix-blend-plus-lighter"
    />
  )
}
