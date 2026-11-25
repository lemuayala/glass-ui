import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"

export default defineConfig([
  ...nextVitals,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "next-env.d.ts",
    "videos/**",
    ".agents/**",
  ]),
  {
    rules: {
      // Common in Next apps: hydration gate (mounted) and URL-driven initial state
      "react-hooks/set-state-in-effect": "off",
    },
  },
])
