import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command, isPreview }) => ({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: command === 'serve' && !isPreview ? '/' : '/react-pokemon-zukan/',
}))
