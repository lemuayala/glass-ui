import { SITE_URL } from "@/lib/config"
import { buildRegistry, getRegistryItem, listRegistryItemNames } from "@/lib/glass-core/registry"

/**
 * shadcn-compatible registry: `/r/registry.json` (index) and `/r/<item>.json` (installable items).
 * Built at deploy time from @lemuayala/glass-ui-core, so it always matches the CLI and MCP output.
 */
export const dynamic = "force-static"
export const dynamicParams = false

const REGISTRY_BASE_URL = `${SITE_URL}/r`
const INDEX_FILE = "registry.json"

export function generateStaticParams() {
  return [INDEX_FILE, ...listRegistryItemNames().map((name) => `${name}.json`)].map((item) => ({ item }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ item: string }> }) {
  const { item } = await params
  const body =
    item === INDEX_FILE
      ? buildRegistry(REGISTRY_BASE_URL, SITE_URL)
      : item.endsWith(".json")
        ? getRegistryItem(item.slice(0, -".json".length), REGISTRY_BASE_URL)
        : undefined

  if (!body) return Response.json({ error: `Unknown registry item: ${item}` }, { status: 404 })
  return Response.json(body, {
    headers: { "Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=0, must-revalidate" },
  })
}
