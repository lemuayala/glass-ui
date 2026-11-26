import { fetchProjectStats } from "@/lib/project-stats"

/** Cached project stats for the header pills. See lib/project-stats.ts. */
export const revalidate = 3600

export async function GET() {
  return Response.json(await fetchProjectStats())
}
