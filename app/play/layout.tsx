import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Playground — Glass UI",
  description: "Design and export glassmorphism components for React Web and React Native.",
}

export default function PlayLayout({ children }: { children: React.ReactNode }) {
  return children
}
