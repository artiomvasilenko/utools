import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import Sitemap from "vite-plugin-sitemap";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    Sitemap({ hostname: "https://use-tools.ru" }),
  ],
  base: "/", //дописывать base: "static/" при build
  build: {
    outDir: "dist",
    assetsDir: "assets",
    manifest: true,
  },
});
