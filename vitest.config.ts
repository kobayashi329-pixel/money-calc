import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    // 計算ロジック（/lib）は純粋関数なので node 環境で十分・高速
    environment: "node",
    globals: true,
    include: ["lib/**/*.test.ts", "lib/**/*.test.tsx"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
