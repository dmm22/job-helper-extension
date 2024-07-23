import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../../dist/popup/",
    rollupOptions: {
      input: {
        main: "index.html"
      }
    }
  },
  resolve: {
    alias: {
      "@": "../"
    }
  },
  base: ""
})
