import path from "path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    exclude: [
      "node_modules/**",
      ".next/**",
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
        "lib/**/*.ts",
        "lib/**/*.tsx",
        "hooks/**/*.ts",
        "components/glass/use-url-state.ts",
        "components/glass/use-shortcuts.ts",
      ],
      exclude: [
        "**/*.test.ts",
        "**/*.test.tsx",
        "lib/glass-core/types.ts",
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
      "@": path.resolve(__dirname, "."),
    },
  },
})
