import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          motion: ['framer-motion', 'gsap', '@gsap/react'],
          maps: ['react-simple-maps', 'react-tooltip', 'd3-geo'],
          icons: ['lucide-react'],
        },
      },
    },
  },
  server: {
    host: true,   // listen on 0.0.0.0 — accessible over the network
    port: 5173,
  },
})
