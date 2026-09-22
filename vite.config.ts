/// <reference types="vitest/config" />
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // The router plugin runs before React so it can code-split route files first.
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      generatedRouteTree: './src/route-tree.gen.ts',
    }),
    react(),
    tailwindcss(),
  ],
  server: {
    // With VITE_API_URL=/api, development requests go to your backend on port 8080.
    proxy: { '/api': { target: 'http://localhost:8080', changeOrigin: true } },
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      '@locales': path.resolve(import.meta.dirname, './public/locales'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/integrations/test-setup.ts'],
    css: false,
    testTimeout: 30_000,
  },
})
