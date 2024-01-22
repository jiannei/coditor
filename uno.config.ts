import {
  defineConfig,
  presetTypography,
  presetUno,
  transformerDirectives,
} from 'unocss'
import presetIcons from '@unocss/preset-icons'

export default defineConfig({
  content: {
    filesystem: [
      './resources/**/*.vue',
    ],
  },
  safelist: [
    'i-tabler:bold',
    'i-tabler:italic',
    'i-tabler:strikethrough',
    'i-tabler:braces',
    'i-tabler:code',
    'i-tabler:quote',
    'i-tabler:separator',
    'i-tabler:text-wrap',
    'i-tabler:photo',
    'i-tabler:arrow-back-up',
    'i-tabler:arrow-forward-up',
  ],
  presets: [
    presetUno(),
    presetIcons(),
    presetTypography(),
  ],
  transformers: [
    transformerDirectives(),
  ],
})
