<script setup>
import { ref } from 'vue'
import { commonmark, headingIdGenerator } from '@milkdown/preset-commonmark'
import { listener, listenerCtx } from '@milkdown/plugin-listener'
import { clipboard } from '@milkdown/plugin-clipboard'
import { placeholder, placeholderConfig } from '@s2nc/milkdown-plugin-placeholder'
import { gfm } from '@milkdown/preset-gfm'
import { history } from '@milkdown/plugin-history'
import { indent } from '@milkdown/plugin-indent'
import { emoji } from '@milkdown/plugin-emoji'
import { shiki, shikiConfig } from '@s2nc/milkdown-plugin-shiki'
import { remoteUpload, remoteUploader } from '@s2nc/milkdown-plugin-upload'
import { defaultValueCtx, editorViewOptionsCtx } from '@milkdown/core'
import { nanoid } from '@milkdown/utils'
import { uploadConfig } from '@milkdown/plugin-upload'
import { Decoration } from '@milkdown/prose/view'
import { useFileDialog } from '@vueuse/core'
import { CoditorContainer, CoditorToobarItem, CoditorToorbar } from '@'
import MilkdownEditorWrapper from '@/components/MilkdownEditorWrapper.vue'
import 'prosemirror-view/style/prosemirror.css'
import 'prosemirror-tables/style/tables.css'
import '@/assets/css/editor.css'

defineProps({
  toolbar: {
    type: Array,
    default: () => [],
  },
})

const editor = ref()

const headings = ref([])
const content = defineModel('content', { default: '' })

const plugin = ref([
  commonmark,
  listener,
  clipboard,
  placeholder,
  gfm,
  history,
  indent,
  emoji,
  shiki,
  remoteUpload,
])

function config(ctx) {
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

  ctx.set(placeholderConfig.key, '开始分享你的故事～')

  ctx.set(shikiConfig.key, {
    themes: { light: 'dracula', dark: 'dracula-soft' },
    langs: ['bash', 'c', 'css', 'go', 'html', 'java', 'javascript', 'js', 'json', 'markdown', 'php', 'python', 'sql', 'sh', 'rust'],
    dark: false,
  })

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
}

const { open, onChange } = useFileDialog({ accept: 'image/*' })

onChange(files => call('RemoteUpload', files))

function call(command, payload) {
  if (command === 'RemoteUpload' && !payload) {
    open()
    return
  }

  editor.value.call(command, payload)
}
</script>

<template>
  <CoditorContainer class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-slate-300 hover:dark:border-slate-600 rounded-md shadow-sm">
    <CoditorToorbar :toolbar="toolbar" class="w-full bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-t-md flex items-center space-x-1">
      <CoditorToobarItem
        v-for="(item, key) in toolbar"
        :key="key"
        :command="item.command"
        class="px-2 py-1 hover:bg-white dark:hover:bg-slate-900 rounded-md cursor-pointer"
        @click="call"
      >
        <button type="button" :class="[`i-tabler:${item.icon}`]" class="w-4 h-4" />
      </CoditorToobarItem>
    </CoditorToorbar>

    <MilkdownEditorWrapper ref="editor" :config="config" :plugin="plugin" />
  </CoditorContainer>
</template>
