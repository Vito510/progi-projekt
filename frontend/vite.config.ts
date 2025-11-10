import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/me': 'https://progi-projekt.onrender.com',
      '/auth': 'https://progi-projekt.onrender.com',
      '/logout': 'https://progi-projekt.onrender.com'
    }
  }
})
