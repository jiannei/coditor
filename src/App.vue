<script setup>
import { ref } from 'vue'

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
import { remoteUpload, remoteUploader } from '@s2nc/milkdown-plugin-upload'
import { Decoration } from '@milkdown/prose/view'
import { uploadConfig } from '@milkdown/plugin-upload'
import { headingIdGenerator } from '@milkdown/preset-commonmark'
import { nanoid } from '@milkdown/utils'
import { listenerCtx } from '@milkdown/plugin-listener'
import Coditor from './components/Coditor.vue'
import CoditorContainer from './components/CoditorContainer.vue'
import CoditorToolbarItem from './components/CoditorToolbarItem.vue'
import CoditorToolbar from './components/CoditorToolbar.vue'

const headings = ref([])
const content = defineModel('content', { default: '' })

const plugins = ref([
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
  {
    config: (ctx) => { // heading
      ctx.set(headingIdGenerator.key, (node) => {
        let id = node.attrs.id

        if (!id)
          id = nanoid()

        headings.value.push({
          text: node.textContent,
          level: node.attrs.level,
          id,
        })

        return id
      })
    },
  },
  {
    config: (ctx) => {
      // 内容监听
      ctx.get(listenerCtx).markdownUpdated((ctx, markdown) => {
        content.value = markdown
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
  { plugin: remoteUpload, config: (ctx) => {
    ctx.update(uploadConfig.key, (prev) => {
      return {
        ...prev,
        uploader: remoteUploader(ctx),
        uploadWidgetFactory: (pos, spec) => {
          const widgetDOM = document.createElement('span')
          widgetDOM.classList.add(...['w-4', 'h-4', 'inline-block', 'i-tabler:loader', 'text-slate-500', 'dark:text-slate-400', 'animate-spin'])

          return Decoration.widget(pos, widgetDOM, spec)
        },
      }
    })
  } },
])

const toolbar = ref([
  { icon: 'bold', command: 'ToggleStrong' },
  { icon: 'italic', command: 'ToggleEmphasis' },
  { icon: 'strikethrough', command: 'ToggleStrikeThrough' },
  { icon: 'braces', command: 'ToggleInlineCode' },
  { icon: 'code', command: 'CreateCodeBlock' },
  { icon: 'quote', command: 'WrapInBlockquote' },
  { icon: 'separator', command: 'InsertHr' },
  { icon: 'text-wrap', command: 'InsertHardbreak' },
  { icon: 'photo', command: 'RemoteUpload' },
  { icon: 'arrow-back-up', command: 'Undo' },
  { icon: 'arrow-forward-up', command: 'Redo' },
])

let callback = null

const { open, onChange } = useFileDialog({ accept: 'image/*' })

onChange(files => callback('RemoteUpload', files))

function call(command, callCommand) {
  callback = callCommand

  if (command === 'RemoteUpload') {
    open()
    return
  }

  callCommand(command)
}
</script>

<template>
  <div class="h-dvh flex items-center justify-center bg-stone-100 dark:bg-slate-800">
    <div class="max-w-6xl mx-auto w-full">
      <CoditorContainer class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-slate-300 hover:dark:border-slate-600 rounded-md shadow-sm">
        <CoditorToolbar :toolbar="toolbar" class="w-full bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-t-md flex items-center space-x-1">
          <CoditorToolbarItem v-for="(item, key) in toolbar" :key="key" :command="item.command" class="px-2 py-1 hover:bg-white dark:hover:bg-slate-900 rounded-md cursor-pointer" @call="call">
            <button type="button" :class="[`i-tabler:${item.icon}`]" class="w-4 h-4" />
          </CoditorToolbarItem>
        </CoditorToolbar>

        <Coditor :content="content" :plugins="plugins" />
      </CoditorContainer>
    </div>
  </div>
</template>
