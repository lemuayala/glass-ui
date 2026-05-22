import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Glass UI — React Native + NativeWind",
  description:
    "Export glassmorphism primitives for React Native with NativeWind. CVA variants, inline snippets, and GLASS.md prompts.",
}

export default function NativeLayout({ children }: { children: React.ReactNode }) {
  return children
}
