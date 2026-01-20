import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

let backend = "https://progi-projekt.onrender.com"

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      '/auth': backend,
      '/logout': backend,
      '/api': {
        target: backend,
        changeOrigin: true,
        secure: false
      }
    }
  }
})

