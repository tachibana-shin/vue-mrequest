/// <reference types="vitest" />

import { fileURLToPath, URL } from "node:url"

import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"
import dts from "vite-plugin-dts"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    dts({
      rollupTypes: true,
      tsconfigPath: "./tsconfig.app.json"
    })
  ],
  resolve: {
    alias: {
      src: fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  build: {
    lib: {
      entry: "lib/index.ts",
      formats: ["es"]
    },
    rollupOptions: {
      external: ["@vueuse/core", "ts-retry", "lodash.get", "vue"]
    }
  },
  test: {
    globals: true
  }
})
