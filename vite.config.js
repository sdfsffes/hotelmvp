import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    devSourcemap: false,
    postcss: {
      plugins: []
    }
  },
  build: {
    cssMinify: false,
    minify: false,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  },
  esbuild: {
    minify: false
  }
})