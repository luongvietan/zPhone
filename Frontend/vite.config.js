import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [], // Đảm bảo không externalize module react-router-dom
    },
    outDir: "dist",
  },
});
