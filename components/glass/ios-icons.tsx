import * as React from "react"
import { cn } from "@/lib/utils"

type IconProps = React.SVGProps<SVGSVGElement>

// Mock iOS Status Bar Icons
export function IosWifi({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("h-4 w-4", className)} {...props}>
      <path d="M12 21.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm-4.6-4.6c2.5-2.5 6.6-2.5 9.2 0 .4.4 1 .4 1.4 0s.4-1 0-1.4c-3.3-3.3-8.6-3.3-11.9 0-.4.4-.4 1 0 1.4.3.4.9.4 1.3 0zm-3.6-3.6c4.5-4.5 11.8-4.5 16.3 0 .4.4 1 .4 1.4 0s.4-1 0-1.4c-5.3-5.3-13.8-5.3-19.1 0-.4.4-.4 1 0 1.4.4.4 1 .4 1.4 0zM.2 9.7c6.5-6.5 17.1-6.5 23.6 0 .4.4 1 .4 1.4 0s.4-1 0-1.4C17.9 1 6.1 1-.8 8.3c-.4.4-.4 1 0 1.4.4.4 1 .4 1 0z" />
    </svg>
  )
}

export function IosBattery({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("h-4 w-4", className)} {...props}>
      <path fillRule="evenodd" d="M3 7.5A2.5 2.5 0 0 0 .5 10v4A2.5 2.5 0 0 0 3 16.5h15A2.5 2.5 0 0 0 20.5 14v-4A2.5 2.5 0 0 0 18 7.5H3zM2 10a1 1 0 0 1 1-1h15a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-4zm20.5 3v-2c.83 0 1.5.67 1.5 1.5S23.33 13 22.5 13z" clipRule="evenodd" />
      {/* Battery fill level (roughly 80%) */}
      <rect x="2.5" y="9.5" width="12" height="5" rx="0.5" />
    </svg>
  )
}

export function IosCellular({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("h-4 w-4", className)} {...props}>
      <rect x="1" y="16" width="3.5" height="5" rx="1" />
      <rect x="7" y="11" width="3.5" height="10" rx="1" />
      <rect x="13" y="6" width="3.5" height="15" rx="1" />
      <rect x="19" y="1" width="3.5" height="20" rx="1" opacity="0.3" />
    </svg>
  )
}

// App / Action Icons (approximating iOS native style)
export function IosCamera({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cn("h-5 w-5", className)} {...props}>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}

export function IosCompass({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cn("h-5 w-5", className)} {...props}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  )
}

export function IosPhotos({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cn("h-5 w-5", className)} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M9 13a4 4 0 1 1-6 0 4 4 0 0 1 6 0z" />
      <path d="M15 13a4 4 0 1 1-6 0 4 4 0 0 1 6 0z" />
      <path d="M21 13a4 4 0 1 1-6 0 4 4 0 0 1 6 0z" />
    </svg>
  )
}

export function IosWeather({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cn("h-5 w-5", className)} {...props}>
      <path d="M17.5 19c2.5 0 4.5-2 4.5-4.5s-2-4.5-4.5-4.5c-.2 0-.3 0-.5.1-1-3-4.2-4.6-7.2-3.6-2.5.8-4.2 3-4.3 5.5-2 .5-3.5 2.2-3.5 4.3 0 2.5 2 4.5 4.5 4.5" />
    </svg>
  )
}

export function IosMusic({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("h-5 w-5", className)} {...props}>
      <path d="M21 3v13.5c0 2.5-2 4.5-4.5 4.5S12 19 12 16.5 14 12 16.5 12c.5 0 1 .1 1.5.3V5.5L8 7v10.5C8 20 6 22 3.5 22S-1 20-1 17.5 1 13 3.5 13c.5 0 1 .1 1.5.3V3a2 2 0 0 1 1.6-2L19 1c1.1-.3 2 .6 2 2z" />
    </svg>
  )
}

export function IosBell({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cn("h-5 w-5", className)} {...props}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

export function IosSearch({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cn("h-5 w-5", className)} {...props}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

export function IosHeart({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cn("h-5 w-5", className)} {...props}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

export function IosStar({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cn("h-5 w-5", className)} {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

export function IosHome({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cn("h-5 w-5", className)} {...props}>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

export function IosUser({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cn("h-5 w-5", className)} {...props}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

export function IosCoffee({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cn("h-5 w-5", className)} {...props}>
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <line x1="6" x2="6" y1="2" y2="4" />
      <line x1="10" x2="10" y1="2" y2="4" />
      <line x1="14" x2="14" y1="2" y2="4" />
    </svg>
  )
}

export function IosPalette({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cn("h-5 w-5", className)} {...props}>
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.992 6.012 17.5 2 12 2z" />
    </svg>
  )
}

export function IosCloud({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cn("h-5 w-5", className)} {...props}>
      <path d="M17.5 19c2.5 0 4.5-2 4.5-4.5s-2-4.5-4.5-4.5c-.2 0-.3 0-.5.1-1-3-4.2-4.6-7.2-3.6-2.5.8-4.2 3-4.3 5.5-2 .5-3.5 2.2-3.5 4.3 0 2.5 2 4.5 4.5 4.5h11z" />
    </svg>
  )
}

export function IosSparkles({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cn("h-5 w-5", className)} {...props}>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
      <path d="M20 3v4" />
      <path d="M22 5h-4" />
      <path d="M4 17v2" />
      <path d="M5 18H3" />
    </svg>
  )
}
