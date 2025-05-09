import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 8080,
    allowedHosts: ['soft-octopus-32.loca.lt'], // ✅ добавлено это
    proxy: {
      '/api/outages': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/outages/, '/api/outages'),
      },
      '/api/news': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/news/, '/api/news'),
      },
      '/send_alert': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/send_alert/, '/send_alert'),
      },
    },
  },
})
