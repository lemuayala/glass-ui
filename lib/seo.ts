import type { Metadata } from "next"
import { SITE, SITE_AUTHOR, SITE_URL } from "@/lib/config"

const DEFAULT_TITLE =
  "Glass UI — Glassmorphism Playground & GLASS.md for Tailwind & NativeWind"

const DEFAULT_DESCRIPTION =
  "Design iOS-style glassmorphism in a live playground. Export Tailwind and NativeWind TSX, CVA components, shareable URLs, and GLASS.md."

export const SEO_KEYWORDS = [
  "glassmorphism",
  "glass UI",
  "tailwind glass",
  "NativeWind",
  "React Native",
  "CVA components",
  "GLASS.md",
  "Cursor",
  "iOS UI",
  "backdrop blur",
  "design playground",
]

export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE.name,
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    creator: {
      "@type": "Person",
      name: SITE_AUTHOR.name,
      url: SITE_AUTHOR.github,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  }
}

export function rootMetadata(): Metadata {
  const ogImage = "/og-image.png"

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: DEFAULT_TITLE,
      template: `%s · ${SITE.name}`,
    },
    description: DEFAULT_DESCRIPTION,
    keywords: SEO_KEYWORDS,
    authors: [{ name: SITE_AUTHOR.name, url: SITE_AUTHOR.github }],
    creator: SITE_AUTHOR.name,
    robots: { index: true, follow: true },
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      alternateLocale: ["es_ES"],
      url: "/",
      siteName: SITE.name,
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "Glass UI — glassmorphism playground and GLASS.md export",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      images: [ogImage],
    },
  }
}

export const PLAY_METADATA: Metadata = {
  title: "Playground",
  description:
    "Tune glass primitives with live iPhone and iPad preview. Export web and native TSX, CVA components, and GLASS.md.",
  alternates: { canonical: "/play" },
  openGraph: {
    title: "Playground — Glass UI",
    description:
      "Live glassmorphism editor with device preview, presets, and GLASS.md export.",
    url: "/play",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Glass UI playground" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Playground — Glass UI",
    images: ["/og-image.png"],
  },
}
