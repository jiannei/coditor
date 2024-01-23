import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), UnoCSS()],
  build: {
    lib: {
      entry: 'src/index.js',
      formats: ['es', 'cjs', 'umd'],
      name: 'coditor',
      fileName: format => `coditor.${format}.js`,
    },
    rollupOptions: {
      // https://rollupjs.org/configuration-options/
      external: ['vue', '@milkdown/vue', '@milkdown/core', '@milkdown/preset-commonmark'],
      output: {
        exports: 'named', // https://rollupjs.org/configuration-options/#output-exports
        globals: {
          'vue': 'Vue',
          '@milkdown/vue': 'Milkdown',
          '@milkdown/core': 'MilkdownCore',
          '@milkdown/preset-commonmark': 'MilkdownCommonmark',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
