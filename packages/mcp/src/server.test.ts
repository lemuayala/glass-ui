import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { createGlassMcpServer, printMcpClientConfig } from "./server.js"

describe("@lemuayala/glass-ui-mcp server end-to-end over MCP protocol", () => {
  let client: Client

  beforeEach(async () => {
    const server = createGlassMcpServer()
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()
    client = new Client({ name: "test-client", version: "1.0.0" })
    await Promise.all([server.connect(serverTransport), client.connect(clientTransport)])
  })

  afterEach(async () => {
    await client.close()
  })

  it("exposes client config JSON helper", () => {
    const cfg = JSON.parse(printMcpClientConfig())
    expect(cfg.mcpServers["glass-ui"].command).toBe("npx")
    expect(cfg.mcpServers["glass-ui"].args).toEqual(["-y", "@lemuayala/glass-ui-mcp"])
  })

  it("sends usage instructions on initialize so agents prefer the generator tools", () => {
    const instructions = client.getInstructions() ?? ""
    expect(instructions).toContain("generate_component")
    expect(instructions).toContain("Do not hand-write glass styles")
  })

  it("serves the glass_component prompt with the user's request", async () => {
    const prompts = await client.listPrompts()
    expect(prompts.prompts.map((p) => p.name)).toEqual(["glass_component"])

    const prompt = await client.getPrompt({
      name: "glass_component",
      arguments: { request: "a frosted login card", platform: "native" },
    })
    const first = prompt.messages[0]?.content
    const text = first && first.type === "text" ? first.text : ""
    expect(text).toContain("a frosted login card")
    expect(text).toContain("Platform: native.")
    expect(text).toContain("generate_component")
  })

  it("lists all 4 tools and 2 resources and serves resource contents", async () => {
    const tools = await client.listTools()
    expect(tools.tools.map((t) => t.name).sort()).toEqual([
      "generate_component",
      "generate_glass_md",
      "list_presets",
      "list_primitives",
    ])

    const resources = await client.listResources()
    expect(resources.resources.map((r) => r.uri).sort()).toEqual([
      "glass://spec/primitives",
      "glass://spec/rules",
    ])

    const catalog = await client.readResource({ uri: "glass://spec/primitives" })
    const firstContent = catalog.contents[0]
    expect(firstContent && "text" in firstContent ? firstContent.text : "").toContain("glass-card")

    const rules = await client.readResource({ uri: "glass://spec/rules" })
    const rulesContent = rules.contents[0]
    expect(rulesContent && "text" in rulesContent ? rulesContent.text : "").toContain("BlurView")
  })

  it("executes list_primitives, list_presets, generate_component, and generate_glass_md", async () => {
    const primitivesRes = await client.callTool({ name: "list_primitives", arguments: {} })
    const primitivesText = (primitivesRes.content as Array<{ type: string; text: string }>)[0]?.text ?? ""
    expect(JSON.parse(primitivesText).primitives).toHaveLength(7)

    const presetsRes = await client.callTool({ name: "list_presets", arguments: {} })
    const presetsText = (presetsRes.content as Array<{ type: string; text: string }>)[0]?.text ?? ""
    expect(JSON.parse(presetsText)).toHaveLength(6)

    const compRes = await client.callTool({
      name: "generate_component",
      arguments: {
        component: "glass-card",
        platform: "native",
        nativeBlur: "expo-blur",
        preset: "liquid",
        componentPath: "src/components/ui",
      },
    })
    const compJson = JSON.parse(
      (compRes.content as Array<{ type: string; text: string }>)[0]?.text ?? "{}",
    )
    expect(compJson.filePath).toBe("src/components/ui/glass-card.tsx")
    expect(compJson.preset).toBe("Liquid Glass")
    expect(compJson.code).toContain("BlurView")
    expect(compJson.installCommand).toContain("npx expo install expo-blur")
    expect(compJson.registry).toEqual({
      name: "glass-card-liquid-native",
      url: "https://glass-ui-play.vercel.app/r/glass-card-liquid-native.json",
      shadcnCommand: "npx shadcn@latest add https://glass-ui-play.vercel.app/r/glass-card-liquid-native.json",
    })

    const customRes = await client.callTool({
      name: "generate_component",
      arguments: { component: "glass-button", options: { tint: "pink" } },
    })
    const customJson = JSON.parse(
      (customRes.content as Array<{ type: string; text: string }>)[0]?.text ?? "{}",
    )
    // Custom overrides are not a published registry item, so there is no shadcn shortcut.
    expect(customJson.registry).toBeNull()

    const mdRes = await client.callTool({
      name: "generate_glass_md",
      arguments: {
        component: "glass-switch",
        platform: "web",
        mode: "reusable",
        preset: "frosted",
        format: "full",
      },
    })
    const mdText = (mdRes.content as Array<{ type: string; text: string }>)[0]?.text ?? ""
    expect(mdText).toContain("# GLASS.md — GlassSwitch")
    expect(mdText).toContain("| Preset | Frosted |")

    const shortRes = await client.callTool({
      name: "generate_glass_md",
      arguments: {
        component: "glass-switch",
        platform: "native",
        mode: "inline",
        format: "short",
      },
    })
    const shortText = (shortRes.content as Array<{ type: string; text: string }>)[0]?.text ?? ""
    expect(shortText).toContain("expo-blur (<BlurView>)")
  })
})
