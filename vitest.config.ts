import path from "path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    exclude: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "e2e/**",
      "videos/**",
      ".agents/**",
      "playwright-report/**",
      "test-results/**",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: [
        "packages/core/src/**/*.ts",
        "packages/mcp/src/**/*.ts",
        "lib/**/*.ts",
        "lib/**/*.tsx",
        "hooks/**/*.ts",
        "components/glass/use-url-state.ts",
        "components/glass/use-shortcuts.ts",
      ],
      exclude: [
        "**/*.test.ts",
        "**/*.test.tsx",
        "packages/core/src/types.ts",
        "packages/core/src/index.ts",
        "packages/core/src/cli.ts",
        "packages/mcp/src/index.ts",
        "packages/mcp/src/cli.ts",
        "lib/glass-core/*.ts",
        "lib/landing-motion.ts",
      ],
      thresholds: {
        statements: 85,
        branches: 80,
        functions: 85,
        lines: 85,
      },
    },
  },
  resolve: {
    alias: {
      "@glass-ui/core": path.resolve(__dirname, "packages/core/src/index.ts"),
      "@": path.resolve(__dirname, "."),
    },
  },
})
