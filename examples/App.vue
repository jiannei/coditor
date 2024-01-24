<script setup>
import { ref } from 'vue'
import 'prosemirror-view/style/prosemirror.css'
import 'prosemirror-tables/style/tables.css'
import './assets/css/editor.css'

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
import { listener, listenerCtx } from '@milkdown/plugin-listener'
import { commandsCtx, defaultValueCtx, editorViewOptionsCtx } from '@milkdown/core'
import { MilkdownProvider } from '@milkdown/vue'
import MilkdownEditor from '@/components/MilkdownEditor.vue'

const headings = ref([])
const content = defineModel('content', { default: '' })

const plugins = ref([
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
      ctx.update(editorViewOptionsCtx, (prev) => {
        return {
          ...prev,
          attributes: {
            class: 'min-h-[24rem] max-w-none prose prose-slate dark:prose-invert outline-none',
          },
          editable: () => true,
        }
      })

      ctx.set(defaultValueCtx, content.value)

      // 内容监听
      ctx.get(listenerCtx).markdownUpdated((ctx, markdown) => {
        content.value = markdown
      })
    },
  },
  // 插件配置
  { plugin: listener }, // 只读模式不需要
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

const { open, onChange } = useFileDialog({ accept: 'image/*' })

onChange(files => call('RemoteUpload', files))

const editor = ref()

function call(command, payload) {
  if (command === 'RemoteUpload' && !payload) {
    open()
    return
  }

  editor.value.get().action(ctx => ctx.get(commandsCtx).call(command, payload))
}
</script>

<template>
  <div class="h-dvh flex items-center justify-center bg-stone-100 dark:bg-slate-800">
    <div class="max-w-6xl mx-auto w-full">
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-slate-300 hover:dark:border-slate-600 rounded-md shadow-sm">
        <ul v-if="toolbar.length" class="w-full bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-t-md flex items-center space-x-1">
          <li
            v-for="(item, key) in toolbar" :key="key"
            class="px-2 py-1 hover:bg-white dark:hover:bg-slate-900 rounded-md cursor-pointer"
            @mousedown.prevent
            @mouseup="call(item.command)"
          >
            <button type="button" :class="[`i-tabler:${item.icon}`]" class="w-4 h-4" />
          </li>
        </ul>

        <MilkdownProvider>
          <MilkdownEditor ref="editor" :plugins="plugins" />
        </MilkdownProvider>
      </div>
    </div>
  </div>
</template>
