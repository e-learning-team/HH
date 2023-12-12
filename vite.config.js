import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://e-learning.up.railway.app',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => { console.log(path); return path.replace('/^\/api/', '') }
      }
    }
  }
})
