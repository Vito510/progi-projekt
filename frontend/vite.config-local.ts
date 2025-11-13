import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

let backend = "http://localhost:8080"

export default defineConfig({
  plugins: [react()],
  server: {
    host: false,
    proxy: {
      '/me': {
        target: backend,
        changeOrigin: true,
        secure: false
      },
      '/auth': backend,
      '/logout': backend,
      '/check-username': backend,
      '/create-user': backend
    }
  }
})

