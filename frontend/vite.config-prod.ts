import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

let backend = "https://progi-projekt.onrender.com"

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      '/me': backend,
      '/auth': backend,
      '/logout': backend
    }
  }
})

