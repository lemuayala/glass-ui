/**
 * Soft, animated mesh behind the entire app shell.
 * Orbs are dimmer in light mode and brighter in dark mode via Tailwind dark: prefix.
 */
export function AppBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div
        className="gg-orb absolute -top-40 -left-40 h-[36rem] w-[36rem] rounded-full opacity-15 blur-3xl dark:opacity-40"
        style={{ background: "radial-gradient(circle at center, #0a84ff 0%, transparent 65%)" }}
      />
      <div
        className="gg-orb gg-orb-2 absolute top-1/3 -right-40 h-[34rem] w-[34rem] rounded-full opacity-10 blur-3xl dark:opacity-25"
        style={{ background: "radial-gradient(circle at center, #38f9d7 0%, transparent 65%)" }}
      />
      <div
        className="gg-orb gg-orb-3 absolute -bottom-40 left-1/4 h-[40rem] w-[40rem] rounded-full opacity-10 blur-3xl dark:opacity-25"
        style={{ background: "radial-gradient(circle at center, #ff7a59 0%, transparent 65%)" }}
      />
      {/* fine grain noise — only on dark for subtle texture */}
      <div
        className="absolute inset-0 opacity-0 mix-blend-overlay dark:opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
    </div>
  )
}
