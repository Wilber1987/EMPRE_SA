import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup/jsdom-polyfills.js"],
    include: ["tests/**/*.test.js"],
    testTimeout: 15000,
    restoreMocks: true,
    clearMocks: true,
    reporters: ["default"],
    coverage: {
      provider: "v8",
      // El codigo fuente bajo prueba vive en el submodulo WDevCore, fuera de
      // esta carpeta, por eso se permite instrumentar archivos externos.
      allowExternal: true,
      include: ["**/ModelPropertyFormBuilder.js"],
      reporter: ["text", "html"],
      reportsDirectory: "./coverage",
    },
  },
});
