import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-vite-plugin'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      routesDirectory: './src/pages',
      generatedRouteTree: './src/routeTree.gen.ts',
    }),
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/me': 'http://localhost:3333',
      '/budgets': 'http://localhost:3333',
      '/proposals/minimal-details': 'http://localhost:3333',
      '/customers': 'http://localhost:3333',
      '/payments': 'http://localhost:3333',
      '/services': 'http://localhost:3333',
      '/is-complete-register': 'http://localhost:3333',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
