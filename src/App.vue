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
import { commonmark } from '@milkdown/preset-commonmark'
import { listener } from '@milkdown/plugin-listener'
import { indent } from '@milkdown/plugin-indent'
import { emoji } from '@milkdown/plugin-emoji'
import { shiki, shikiConfig } from '@s2nc/milkdown-plugin-shiki'
import Coditor from './components/Coditor.vue'

const plugins = ref([
  // 编辑器配置
  { config: (ctx) => { // 主题
    ctx.update(editorViewOptionsCtx, (prev) => {
      return {
        ...prev,
        attributes: {
          class: 'max-w-none prose prose-slate dark:prose-invert outline-none',
        },
      }
    })
  } },
  // 插件配置
  { plugin: commonmark }, // 只读模式不需要
  { plugin: listener }, // 只读模式不需要
  { plugin: clipboard }, // 只读模式不需要
  { plugin: gfm },
  { plugin: history },
  { plugin: indent },
  { plugin: emoji },
  { plugin: shiki, config: ctx => ctx.set(shikiConfig.key, {
    themes: { light: 'dracula', dark: 'dracula-soft' },
    langs: ['bash', 'c', 'css', 'go', 'html', 'java', 'javascript', 'js', 'json', 'markdown', 'php', 'python', 'sql', 'sh', 'rust'],
    dark: false,
  }) },
  // { plugin: placeholderPlugin, config: ctx => ctx.set(placeholderConfig.key, '开始分享你的故事吧～') },
])
const content = ref('')

const toolbar = ref([])
</script>

<template>
  <div class="h-dvh flex items-center justify-center">
    <div class="max-w-6xl mx-auto w-full">
      <CoditorContainer v-slot="{ call }" class="border border-slate-200 dark:border-slate-700 hover:border-slate-300 hover:dark:border-slate-600 rounded-md min-h-[24rem]">
        <div v-if="toolbar.length" class="w-full sbg1 px-2 py-1 rounded-t-md">
          <ul class="flex items-center space-x-1">
            <li v-for="(item, key) in toolbar" :key="key" class="px-2 py-1 sbg-h rounded-md cursor-pointer" @click="call(item.command)">
              <button type="button" :class="[`i-tabler-${item.icon}`, item.class]" class="w-4 h-4" />
            </li>
          </ul>
        </div>

        <Coditor v-model:content="content" :plugins="plugins" />
      </CoditorContainer>
    </div>
  </div>
</template>
