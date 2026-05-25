import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "@/components/providers"
import { SiteJsonLd } from "@/components/seo/site-json-ld"
import { rootMetadata } from "@/lib/seo"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  ...rootMetadata(),
  icons: {
    icon: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-icon-light.png", sizes: "180x180", type: "image/png", media: "(prefers-color-scheme: light)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0c" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var r=document.documentElement,m=matchMedia("(max-width:767px)").matches;r.classList.toggle("gg-viewport-mobile",m);r.classList.toggle("gg-viewport-desktop",!m)}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <SiteJsonLd />
        <Providers>{children}</Providers>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
