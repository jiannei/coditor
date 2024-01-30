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
    presetIcons({
      collections: {
        snc: {
          milkdown: '\n'
          + '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">\n'
          + '<path d="M63.0001 53L14.5027 135.5H111.498L63.0001 53Z" fill="#D8DEE9"/>\n'
          + '<path d="M137 53L88.5027 135.5H185.498L137 53Z" fill="#4C566A"/>\n'
          + '<path fill-rule="evenodd" clip-rule="evenodd" d="M140.467 49.0032C143.337 50.66 144.32 54.3296 142.663 57.1993L95.6293 138.664C93.9725 141.534 90.3029 142.517 87.4332 140.86C84.5634 139.203 83.5802 135.534 85.237 132.664L132.271 51.1993C133.928 48.3295 137.597 47.3463 140.467 49.0032Z" fill="#81A1C1"/>\n'
          + '<path fill-rule="evenodd" clip-rule="evenodd" d="M188.196 140.857C191.066 139.2 192.049 135.531 190.392 132.661L143.359 51.1965C141.702 48.3267 138.032 47.3435 135.163 49.0003C132.293 50.6572 131.31 54.3267 132.967 57.1965L180 138.661C181.657 141.531 185.326 142.514 188.196 140.857Z" fill="#81A1C1"/>\n'
          + '<path fill-rule="evenodd" clip-rule="evenodd" d="M55.6921 54C55.6921 50.6863 58.3784 48 61.6921 48H137C140.314 48 143 50.6863 143 54C143 57.3137 140.314 60 137 60H61.6921C58.3784 60 55.6921 57.3137 55.6921 54Z" fill="#81A1C1"/>\n'
          + '<path fill-rule="evenodd" clip-rule="evenodd" d="M9.2004 135.4C9.2004 132.086 11.8867 129.4 15.2004 129.4H89.4475C92.7612 129.4 95.4475 132.086 95.4475 135.4C95.4475 138.714 92.7612 141.4 89.4475 141.4H15.2004C11.8867 141.4 9.2004 138.714 9.2004 135.4Z" fill="#81A1C1"/>\n'
          + '<path fill-rule="evenodd" clip-rule="evenodd" d="M64.1595 49.0032C67.0293 50.66 68.0125 54.3295 66.3557 57.1993L19.3221 138.664C17.6652 141.534 13.9957 142.517 11.1259 140.86C8.25615 139.203 7.2729 135.534 8.92975 132.664L55.9633 51.1993C57.6202 48.3296 61.2897 47.3463 64.1595 49.0032Z" fill="#81A1C1"/>\n'
          + '<path fill-rule="evenodd" clip-rule="evenodd" d="M186 132C189.314 132 192 134.686 192 138V148C192 151.314 189.314 154 186 154C182.686 154 180 151.314 180 148V138C180 134.686 182.686 132 186 132Z" fill="#81A1C1"/>\n'
          + '<path fill-rule="evenodd" clip-rule="evenodd" d="M14 132C17.3137 132 20 134.686 20 138V148C20 151.314 17.3137 154 14 154C10.6863 154 8 151.314 8 148V138C8 134.686 10.6863 132 14 132Z" fill="#81A1C1"/>\n'
          + '<path fill-rule="evenodd" clip-rule="evenodd" d="M91 132C94.3137 132 97 134.686 97 138V148C97 151.314 94.3137 154 91 154C87.6863 154 85 151.314 85 148V138C85 134.686 87.6863 132 91 132Z" fill="#81A1C1"/>\n'
          + '<path fill-rule="evenodd" clip-rule="evenodd" d="M63 77C63 74.7909 64.7909 73 67 73H103C105.209 73 107 74.7909 107 77C107 79.2091 105.209 81 103 81H67C64.7909 81 63 79.2091 63 77Z" fill="#4C566A"/>\n'
          + '<path fill-rule="evenodd" clip-rule="evenodd" d="M52 95C52 92.7909 53.7909 91 56 91H92C94.2091 91 96 92.7909 96 95C96 97.2091 94.2091 99 92 99H56C53.7909 99 52 97.2091 52 95Z" fill="#4C566A"/>\n'
          + '<path fill-rule="evenodd" clip-rule="evenodd" d="M42 113C42 110.791 43.7909 109 46 109H82C84.2091 109 86 110.791 86 113C86 115.209 84.2091 117 82 117H46C43.7909 117 42 115.209 42 113Z" fill="#4C566A"/>\n'
          + '</svg>\n',
        },
      },
    }),
    presetTypography(),
  ],
  transformers: [
    transformerDirectives(),
  ],
})
