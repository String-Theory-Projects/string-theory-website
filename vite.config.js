import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    // cura-wasm uses threads.js workers internally; pre-bundling breaks worker resolution
    exclude: ['cura-wasm', 'cura-wasm-definitions'],
  },
})
