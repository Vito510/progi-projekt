import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

let backend = "http://localhost:8080"

export default defineConfig({
  plugins: [react()],
  server: {
    host: false,
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

