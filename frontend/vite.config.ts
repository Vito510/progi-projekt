import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(() => {
  const port = Number(process.env.PORT) || 5173  // Default to 5173 if not set

  return {
    plugins: [react()],
    server: {
      port,
      host: true, // makes it accessible from outside the container
    },
    preview: {
      port,
      host: true,
    },
  }
})
