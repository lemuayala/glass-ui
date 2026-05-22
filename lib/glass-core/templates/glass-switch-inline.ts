import { getGlassSwitchClasses } from "../variants"
import type { GlassOptions } from "../types"

export function renderGlassSwitchInline(options: GlassOptions): string {
  const trackClasses = getGlassSwitchClasses(options).trim().replace(/\s+/g, " ")
  const isDark = options.theme === "dark"
  const thumbOn = isDark ? "bg-white translate-x-6" : "bg-neutral-900 translate-x-6"
  const thumbOff = isDark ? "bg-white/70 translate-x-0.5" : "bg-neutral-700/80 translate-x-0.5"
  const label = (options.text || "Notifications").replace(/"/g, '\\"')

  return `// 👇 Paste this anywhere in your React component.
"use client"

import { useState } from "react"

export function Example() {
  const [on, setOn] = useState(true)
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => setOn((v) => !v)}
        className="${trackClasses} relative transition-colors"
      >
        <span
          className={\`block h-6 w-6 rounded-full shadow-sm transition-transform \${on ? "${thumbOn}" : "${thumbOff}"}\`}
        />
      </button>
      <span className="text-sm font-medium ${isDark ? "text-white" : "text-neutral-900"}">${label}</span>
    </label>
  )
}
`
}
