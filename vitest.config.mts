import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    include: ["src/integration_test/**/*.test.{ts,tsx}"],
    setupFiles: ["./src/integration_test/setup.ts"],
  },
});
