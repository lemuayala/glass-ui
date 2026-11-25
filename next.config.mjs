/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: "/primitives", destination: "/#primitives", permanent: false },
      { source: "/native", destination: "/#native", permanent: false },
    ]
  },
}

export default nextConfig
