import type { Metadata } from "next"
import { PLAY_METADATA } from "@/lib/seo"

export const metadata: Metadata = PLAY_METADATA

export default function PlayLayout({ children }: { children: React.ReactNode }) {
  return children
}
