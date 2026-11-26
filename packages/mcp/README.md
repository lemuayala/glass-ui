# @lemuayala/glass-ui-mcp

Official [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server for **[Glass UI](https://glass-ui-play.vercel.app)** — lets Claude Code, Cursor, VS Code Copilot, Windsurf, and Antigravity inspect primitives/presets and generate production-ready Web (Tailwind CSS) and React Native (`expo-blur` `<BlurView>` + NativeWind) glass components directly via tool calls.

## Quick Setup

### Claude Code
```bash
claude mcp add glass-ui -- npx -y @lemuayala/glass-ui-mcp
```

### Cursor / Windsurf / Antigravity (`mcp.json`)
```json
{
  "mcpServers": {
    "glass-ui": {
      "command": "npx",
      "args": ["-y", "@lemuayala/glass-ui-mcp"]
    }
  }
}
```

## Tools Exposed

| Tool | Purpose |
| :--- | :--- |
| `list_primitives` | Lists all 7 Glass UI primitives, valid glass option enums, platforms, and defaults. |
| `list_presets` | Lists curated presets (`frosted`, `liquid`, `smoked`, `crystal`, `sunset`, `aqua`). |
| `generate_component` | Generates `.tsx` component code, usage snippet, target file path, and install command. When the result matches a published registry item, `registry.shadcnCommand` installs it with the shadcn CLI. |
| `generate_glass_md` | Generates the full 8-section `GLASS.md` specification (or `short` prompt) for any stack. |

## Agent Instructions

On connect the server sends usage instructions to the agent: generate glass UI through `generate_component` instead of hand-writing styles, detect web vs. React Native from the project, and run the returned install command. Once connected, asking for "a frosted login card" or "a liquid glass tab bar" is enough.

## Prompts Exposed

| Prompt | Arguments | Purpose |
| :--- | :--- | :--- |
| `glass_component` | `request`, `platform?` | Adds a glass component to the current project end to end (pick primitive/preset → generate → write file → install). |

## Resources Exposed

- `glass://spec/primitives` — JSON catalog of primitives, defaults, and presets.
- `glass://spec/rules` — Canonical iOS glassmorphism rules for Tailwind CSS and `expo-blur`.

## License

MIT
