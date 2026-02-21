import { defineVitestConfig } from "@nuxt/test-utils/config";

export default defineVitestConfig({
  test: {
    environment: "nuxt",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text"],
      enabled: true,
      exclude: ["node_modules/**", "tests/**", "**/*.test.ts"],
    },
  },
});
