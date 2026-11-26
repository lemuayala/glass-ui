/**
 * Baseline security headers for every route. A full Content-Security-Policy is not set yet: the layout has an
 * inline viewport script and JSON-LD, and Vercel Analytics loads a script, so it needs nonces and its own testing.
 */
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@lemuayala/glass-ui-core"],
  images: {
    unoptimized: true,
  },
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }]
  },
  async redirects() {
    return [
      { source: "/primitives", destination: "/#primitives", permanent: false },
      { source: "/native", destination: "/#native", permanent: false },
    ]
  },
}

export default nextConfig
