import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import tailwindcss from '@tailwindcss/vite'

//vite config dev

export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
})


