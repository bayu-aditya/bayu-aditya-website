import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.indexOf('/react/') !== -1) {
            return '@react'
          }
          if (id.indexOf('react-router-dom') !== -1) {
            return '@react-router'
          }
          if (id.indexOf('moment') !== -1) {
            return '@moment'
          }
          if (id.indexOf('/react-select/') !== -1) {
            return '@react-select'
          }
        },
      },
    },
  },
})
