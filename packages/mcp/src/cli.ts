#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { createGlassMcpServer, printMcpClientConfig } from "./server.js"

const args = process.argv.slice(2)

if (args.includes("-h") || args.includes("--help")) {
  process.stdout.write(`Glass UI MCP Server (@glass-ui/mcp)

Run over stdio (used by MCP clients):
  npx -y @glass-ui/mcp

Print MCP client JSON config:
  npx -y @glass-ui/mcp --print-config

Add to Claude Code in one command:
  claude mcp add glass-ui -- npx -y @glass-ui/mcp
`)
  process.exit(0)
}

if (args.includes("--print-config") || args[0] === "config") {
  process.stdout.write(`${printMcpClientConfig()}\n`)
  process.exit(0)
}

async function main() {
  const server = createGlassMcpServer()
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

main().catch((err) => {
  process.stderr.write(`Glass UI MCP fatal error: ${err instanceof Error ? err.message : String(err)}\n`)
  process.exit(1)
})
