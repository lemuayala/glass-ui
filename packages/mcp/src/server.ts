import {
  ALL_COMPONENTS,
  COMPONENT_LABELS,
  DEFAULT_PROJECT_PROFILE,
  PRESETS,
  applyPreset,
  defaultsForComponent,
  findMatchingPreset,
  generateCode,
  generateGlassPrompt,
  generateShortGlassPrompt,
  generateUsageSnippet,
  getInstallCommand,
  type ComponentKind,
  type GlassOptions,
  type ProjectProfile,
} from "@lemuayala/glass-ui-core"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"

const componentEnum = z.enum([
  "glass-card",
  "glass-button",
  "glass-input",
  "glass-modal",
  "glass-tabbar",
  "glass-switch",
  "glass-navbar",
])

const platformEnum = z.enum(["web", "native"])
const modeEnum = z.enum(["inline", "reusable"])
const nativeBlurEnum = z.enum(["expo-blur", "nativewind"])
const presetEnum = z.enum(["frosted", "liquid", "smoked", "crystal", "sunset", "aqua"])

const optionsSchema = z
  .object({
    theme: z.enum(["light", "dark"]).optional(),
    blur: z.enum(["none", "sm", "md", "lg", "xl"]).optional(),
    rounded: z.enum(["none", "md", "lg", "xl", "2xl", "3xl", "full"]).optional(),
    intensity: z.enum(["subtle", "medium", "strong"]).optional(),
    border: z.enum(["none", "subtle", "strong"]).optional(),
    padding: z.enum(["sm", "md", "lg"]).optional(),
    shadow: z.enum(["none", "sm", "md", "lg"]).optional(),
    tint: z.enum(["none", "blue", "pink", "orange", "teal"]).optional(),
    text: z.string().max(120).optional(),
  })
  .optional()

const profileSchema = z
  .object({
    framework: z.enum(["next-app-router", "vite-react", "expo", "other"]).optional(),
    tailwindVersion: z.enum(["3", "4"]).optional(),
    componentPath: z.string().optional(),
    packageManager: z.enum(["npm", "pnpm", "yarn"]).optional(),
    hasCnHelper: z.boolean().optional(),
    usesShadcn: z.boolean().optional(),
  })
  .optional()

function resolveOptions(
  component: ComponentKind,
  presetId?: string,
  overrides?: Partial<GlassOptions>,
): { options: GlassOptions; presetName?: string } {
  const base = defaultsForComponent(component)
  const preset = presetId ? PRESETS.find((p) => p.id === presetId) : undefined
  const withPreset = preset ? applyPreset(preset, base.text) : base
  const merged: GlassOptions = {
    ...withPreset,
    ...(overrides ?? {}),
  }
  const matched = findMatchingPreset(merged)
  return { options: merged, presetName: matched?.name }
}

export function printMcpClientConfig(): string {
  return JSON.stringify(
    {
      mcpServers: {
        "glass-ui": {
          command: "npx",
          args: ["-y", "@lemuayala/glass-ui-mcp"],
        },
      },
    },
    null,
    2,
  )
}

/**
 * Sent to the client on `initialize`. Agents read it before choosing tools, so it is the
 * contract that makes them generate glass UI from this server instead of hand-writing it.
 */
export const GLASS_SERVER_INSTRUCTIONS = `Glass UI generates iOS-style glassmorphism components from a single source of truth (the @lemuayala/glass-ui-core design system).

When to use it: any request for a glass, frosted, blurred, translucent or "liquid glass" UI element (card, button, input, modal, tab bar, switch, navbar) for Web (React + Tailwind CSS) or React Native (Expo).

How to use it:
1. Do not hand-write glass styles. Call \`generate_component\` and write the returned \`code\` to \`filePath\` unchanged; adapt only imports or paths to the project.
2. Pick the closest primitive and preset. Call \`list_primitives\` / \`list_presets\` when unsure; use \`options\` only for overrides the user asked for.
3. Detect the platform from the project: Expo / React Native -> platform "native" (expo-blur by default), otherwise "web". Match the project's component folder and package manager.
4. Run the returned \`installCommand\` (or tell the user to) and show the \`usage\` snippet.
5. For a full integration brief to share or keep in the repo, call \`generate_glass_md\`.

Read \`glass://spec/rules\` before editing generated glass code by hand.`

export function createGlassMcpServer(): McpServer {
  const server = new McpServer(
    {
      name: "glass-ui",
      version: "0.5.2",
    },
    { instructions: GLASS_SERVER_INSTRUCTIONS },
  )

  server.registerResource(
    "primitives-catalog",
    "glass://spec/primitives",
    {
      title: "Glass UI Primitives & Presets Catalog",
      description: "Complete JSON catalog of Glass UI primitives, prop enums, defaults, and presets.",
      mimeType: "application/json",
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(
            {
              primitives: ALL_COMPONENTS.map((id) => ({
                id,
                componentName: COMPONENT_LABELS[id],
                defaults: defaultsForComponent(id),
              })),
              presets: PRESETS,
              platforms: ["web", "native"],
              nativeBlurModes: ["expo-blur", "nativewind"],
              exportModes: ["inline", "reusable"],
            },
            null,
            2,
          ),
        },
      ],
    }),
  )

  server.registerResource(
    "glass-design-rules",
    "glass://spec/rules",
    {
      title: "Glass UI Design & Integration Rules",
      description: "Canonical iOS glassmorphism rules for Tailwind CSS v4 and React Native (expo-blur + NativeWind).",
      mimeType: "text/markdown",
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "text/markdown",
          text: `# Glass UI Design Rules

1. **Web (Tailwind CSS):** Always combine \`backdrop-blur-*\` with low-alpha surface fills (\`bg-white/10..50\` or \`bg-black/20..80\`) and hairline semi-transparent borders (\`border-white/10..40\`).
2. **React Native (iOS & Android):** Standard \`<View>\` does not blur background content natively. Render \`<BlurView intensity={...} tint={theme} style={StyleSheet.absoluteFill} pointerEvents="none" />\` from \`expo-blur\` inside a \`relative overflow-hidden\` parent \`View\` / \`Pressable\` so \`UIVisualEffectView\` clips to \`borderRadius\`.
3. **Tints:** Apply colored washes (\`blue\`, \`pink\`, \`orange\`, \`teal\`) via CVA compound variants paired with \`twMerge\` so neutral \`bg-*\` utilities never collide with tint \`bg-*\` utilities.
`,
        },
      ],
    }),
  )

  server.registerTool(
    "list_primitives",
    {
      title: "List Glass UI Primitives",
      description:
        "List all 7 iOS-style Glass UI primitives, supported glass option enums, platforms, and default props.",
    },
    async () => ({
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              primitives: ALL_COMPONENTS.map((id) => ({
                id,
                name: COMPONENT_LABELS[id],
                defaults: defaultsForComponent(id),
              })),
              optionsSchema: {
                theme: ["light", "dark"],
                blur: ["none", "sm", "md", "lg", "xl"],
                rounded: ["none", "md", "lg", "xl", "2xl", "3xl", "full"],
                intensity: ["subtle", "medium", "strong"],
                border: ["none", "subtle", "strong"],
                padding: ["sm", "md", "lg"],
                shadow: ["none", "sm", "md", "lg"],
                tint: ["none", "blue", "pink", "orange", "teal"],
              },
              platforms: ["web", "native"],
              nativeBlurModes: ["expo-blur", "nativewind"],
              exportModes: ["inline", "reusable"],
            },
            null,
            2,
          ),
        },
      ],
    }),
  )

  server.registerTool(
    "list_presets",
    {
      title: "List Glass UI Presets",
      description:
        "List curated iOS glass presets (frosted, liquid, smoked, crystal, sunset, aqua) and their exact GlassOptions.",
    },
    async () => ({
      content: [
        {
          type: "text",
          text: JSON.stringify(PRESETS, null, 2),
        },
      ],
    }),
  )

  server.registerTool(
    "generate_component",
    {
      title: "Generate Glass UI Component TSX",
      description:
        "Generate production-ready TSX component code, usage snippet, and install command for Web (Tailwind CSS) or React Native (expo-blur BlurView / NativeWind).",
      inputSchema: {
        component: componentEnum,
        platform: platformEnum.default("web"),
        mode: modeEnum.default("reusable"),
        nativeBlur: nativeBlurEnum.default("expo-blur"),
        preset: presetEnum.optional(),
        options: optionsSchema,
        componentPath: z.string().default("components/ui"),
        packageManager: z.enum(["npm", "pnpm", "yarn"]).default("pnpm"),
      },
    },
    async ({
      component,
      platform = "web",
      mode = "reusable",
      nativeBlur = "expo-blur",
      preset,
      options: overrides,
      componentPath = "components/ui",
      packageManager = "pnpm",
    }) => {
      const { options, presetName } = resolveOptions(component, preset, overrides)
      const codegen = { component, mode, platform, nativeBlur, options }
      const code = generateCode(codegen)
      const usage = generateUsageSnippet(codegen, componentPath)
      const install = getInstallCommand(
        { ...DEFAULT_PROJECT_PROFILE, packageManager, componentPath },
        platform,
        nativeBlur,
      )

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                component,
                componentName: COMPONENT_LABELS[component],
                filePath: `${componentPath.replace(/\/$/, "")}/${component}.tsx`,
                platform,
                nativeBlur: platform === "native" ? nativeBlur : undefined,
                mode,
                preset: presetName ?? null,
                installCommand: install,
                code,
                usage,
              },
              null,
              2,
            ),
          },
        ],
      }
    },
  )

  server.registerTool(
    "generate_glass_md",
    {
      title: "Generate GLASS.md Specification",
      description:
        "Generate the complete 8-section GLASS.md integration spec (or concise short prompt) tailored to the target project profile.",
      inputSchema: {
        component: componentEnum,
        platform: platformEnum.default("web"),
        mode: modeEnum.default("reusable"),
        nativeBlur: nativeBlurEnum.default("expo-blur"),
        preset: presetEnum.optional(),
        options: optionsSchema,
        profile: profileSchema,
        format: z.enum(["full", "short"]).default("full"),
      },
    },
    async ({
      component,
      platform = "web",
      mode = "reusable",
      nativeBlur = "expo-blur",
      preset,
      options: overrides,
      profile: profilePatch,
      format = "full",
    }) => {
      const { options, presetName } = resolveOptions(component, preset, overrides)
      const mergedProfile: ProjectProfile = {
        ...DEFAULT_PROJECT_PROFILE,
        framework: platform === "native" ? "expo" : DEFAULT_PROJECT_PROFILE.framework,
        ...(profilePatch ?? {}),
      }
      const promptInput = {
        codegen: { component, mode, platform, nativeBlur, options },
        profile: mergedProfile,
        presetName,
      }
      const markdown =
        format === "short"
          ? generateShortGlassPrompt(promptInput)
          : generateGlassPrompt(promptInput)

      return {
        content: [
          {
            type: "text",
            text: markdown,
          },
        ],
      }
    },
  )

  server.registerPrompt(
    "glass_component",
    {
      title: "Add a Glass UI component",
      description:
        "Add an iOS-style glass component to this project using the Glass UI design system (web or React Native).",
      argsSchema: {
        request: z
          .string()
          .describe('What to build, e.g. "a frosted login card" or "liquid glass tab bar"'),
        platform: z
          .string()
          .optional()
          .describe('"web" or "native"; leave empty to detect it from the project'),
      },
    },
    ({ request, platform }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: [
              `Add this to the project with Glass UI: ${request}`,
              "",
              platform
                ? `Platform: ${platform}.`
                : "Detect the platform from the project (Expo / React Native -> native, otherwise web).",
              "Steps: pick the closest primitive and preset (list_primitives / list_presets),",
              "call generate_component, write `code` to `filePath` unchanged, run `installCommand`,",
              "then wire it in using the `usage` snippet. Do not hand-write glass styles.",
            ].join("\n"),
          },
        },
      ],
    }),
  )

  return server
}
