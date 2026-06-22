import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    minify: false
  },
  build: {
    cssMinify: false,
    minify: false
  }
})