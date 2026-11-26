"use client"

import { Fragment, useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { markShown, observeReveal } from "@/lib/reveal-observer"

type RevealProps = {
  children: ReactNode
  className?: string
  /** Stagger step (×70 ms) for lists. */
  delay?: number
  as?: ElementType
  id?: string
  style?: CSSProperties
} & Record<`data-${string}`, string | boolean | undefined>

/**
 * Enters once when scrolled into view: rises, fades in, grows from 96% and comes into focus (focus is skipped on
 * phones). CSS-only motion; visible without JS and still under reduced motion. See `.gg-reveal` in globals.css.
 */
export function Reveal({ children, className, delay = 0, as: Tag = "div", style, ...rest }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  useEffect(() => (ref.current ? observeReveal(ref.current, markShown) : undefined), [])
  return (
    <Tag
      ref={ref}
      className={cn("gg-reveal", className)}
      style={{ "--d": `${delay * 70}ms`, ...style } as CSSProperties}
      {...rest}
    >
      {children}
    </Tag>
  )
}

type RevealWordsProps = {
  text: string
  className?: string
  as?: ElementType
  id?: string
}

/**
 * Heading whose words rise in one after another. The words are plain spans rendered on the server (no DOM
 * rewriting after hydration), so React keeps owning the text and screen readers read the full sentence.
 */
export function RevealWords({ text, className, as: Tag = "h2", id }: RevealWordsProps) {
  const ref = useRef<HTMLElement | null>(null)
  useEffect(() => (ref.current ? observeReveal(ref.current, markShown) : undefined), [text])
  const words = text.split(" ")
  return (
    <Tag ref={ref} id={id} className={cn("gg-reveal-words", className)}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="gg-word" style={{ "--i": i } as CSSProperties}>
            {word}
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  )
}
