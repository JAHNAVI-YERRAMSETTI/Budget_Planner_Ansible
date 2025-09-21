import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 2098,
    proxy: {
      '/api': {
        target: 'http://localhost:2099',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
