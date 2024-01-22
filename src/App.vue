<script setup>
import { ref } from 'vue'
import CoditorContainer from './components/CoditorContainer.vue'

import 'prosemirror-view/style/prosemirror.css'
import 'prosemirror-tables/style/tables.css'
import './assets/css/editor.css'

import { editorViewOptionsCtx } from '@milkdown/core'
import { clipboard } from '@milkdown/plugin-clipboard'
import { history } from '@milkdown/plugin-history'
import { gfm } from '@milkdown/preset-gfm'
import { indent } from '@milkdown/plugin-indent'
import { emoji } from '@milkdown/plugin-emoji'
import { shiki, shikiConfig } from '@s2nc/milkdown-plugin-shiki'
import { placeholder, placeholderConfig } from '@s2nc/milkdown-plugin-placeholder'
import { useFileDialog } from '@vueuse/core'
import Coditor from './components/Coditor.vue'

const plugins = ref([
  // 编辑器配置
  {
    config: (ctx) => { // 主题
      ctx.update(editorViewOptionsCtx, (prev) => {
        return {
          ...prev,
          attributes: {
            class: 'min-h-[24rem] max-w-none prose prose-slate dark:prose-invert outline-none',
          },
        }
      })
    },
  },
  // 插件配置
  { plugin: clipboard }, // 只读模式不需要
  { plugin: placeholder, config: ctx => ctx.set(placeholderConfig.key, '开始分享你的故事～') },
  { plugin: gfm },
  { plugin: history },
  { plugin: indent },
  { plugin: emoji },
  {
    plugin: shiki,
    config: ctx => ctx.set(shikiConfig.key, {
      themes: { light: 'dracula', dark: 'dracula-soft' },
      langs: ['bash', 'c', 'css', 'go', 'html', 'java', 'javascript', 'js', 'json', 'markdown', 'php', 'python', 'sql', 'sh', 'rust'],
      dark: false,
    }),
  },
])
const content = ref('')

const toolbar = ref([
  { icon: 'bold', name: 'bold', command: 'ToggleStrong' },
  { icon: 'italic', name: 'italic', command: 'ToggleEmphasis' },
  {
    icon: 'strikethrough',
    name: 'strikethrough',
    command: 'ToggleStrikeThrough',
  },
  { icon: 'braces', name: 'inline-code', command: 'ToggleInlineCode' },
  { icon: 'code', name: 'code', command: 'CreateCodeBlock' },
  {
    icon: 'quote',
    name: 'quote',
    command: 'WrapInBlockquote',
  },
  { icon: 'separator', name: 'hr', command: 'InsertHr' },
  { icon: 'text-wrap', name: 'text-wrap', command: 'InsertHardbreak' },
  {
    icon: 'photo',
    name: 'image',
    command: 'RemoteUpload',
  },
  { icon: 'arrow-back-up', name: 'undo', command: 'Undo' },
  { icon: 'arrow-forward-up', name: 'redo', command: 'Redo' },
])

const { open, onChange } = useFileDialog({ accept: 'image/*' })

// onChange(files => call('RemoteUpload', files))
</script>

<template>
  <div class="h-dvh flex items-center justify-center">
    <div class="max-w-6xl mx-auto w-full">
      <CoditorContainer v-slot="{ call }" class="border border-slate-200 dark:border-slate-700 hover:border-slate-300 hover:dark:border-slate-600 rounded-md">
        <div v-if="toolbar.length" class="w-full bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-t-md">
          <ul class="flex items-center space-x-1">
            <li v-for="(item, key) in toolbar" :key="key" class="px-2 py-1 hover:bg-white dark:hover:bg-slate-900 rounded-md cursor-pointer" @mousedown.prevent="call(item.command)">
              <button type="button" :class="[`i-tabler:${item.icon}`, item.class]" class="w-4 h-4" />
            </li>
          </ul>
        </div>

        <Coditor v-model:content="content" :plugins="plugins" @command="call()" />
      </CoditorContainer>
    </div>
  </div>
</template>
