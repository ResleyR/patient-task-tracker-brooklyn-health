import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text"],
      enabled: true,
      exclude: ["node_modules/**", "tests/**", "**/*.test.ts"],
    },
  },
  define: {
    "import.meta.server": false,
  },
  resolve: {
    alias: {
      "~": resolve(__dirname, "."),
      "#imports": resolve(__dirname, "./tests/mocks/imports.ts"),
    },
  },
});
