import {
  defineConfig,
  presetTypography,
  presetUno,
  transformerDirectives,
} from 'unocss'

export default defineConfig({
  content: {
    filesystem: [
      './resources/**/*.vue',
    ],
  },
  presets: [
    presetUno(),
    presetTypography(),
  ],
  transformers: [
    transformerDirectives(),
  ],
})
