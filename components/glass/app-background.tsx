/**
 * Soft, animated mesh used behind the entire app shell.
 * Three subtle drifting orbs over the deep navy background.
 */
export function AppBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div
        className="gg-orb absolute -top-40 -left-40 h-[36rem] w-[36rem] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle at center, #0a84ff 0%, transparent 65%)" }}
      />
      <div
        className="gg-orb gg-orb-2 absolute top-1/3 -right-40 h-[34rem] w-[34rem] rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle at center, #38f9d7 0%, transparent 65%)" }}
      />
      <div
        className="gg-orb gg-orb-3 absolute -bottom-40 left-1/4 h-[40rem] w-[40rem] rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle at center, #ff7a59 0%, transparent 65%)" }}
      />
      {/* fine grain noise */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
    </div>
  )
}
