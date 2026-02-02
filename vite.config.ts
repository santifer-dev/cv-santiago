import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || (id.includes('react') && !id.includes('react-markdown') && !id.includes('react-router'))) {
              return 'vendor-react'
            }
            if (id.includes('react-router') || id.includes('@remix-run')) {
              return 'vendor-router'
            }
            if (id.includes('motion')) {
              return 'vendor-motion'
            }
            // react-markdown and its deps (remark, rehype, mdast, micromark, unified, unist, hast)
            // are NOT in manualChunks — they bundle with FloatingChat's lazy chunk automatically
          }
        },
      },
    },
  },
})
