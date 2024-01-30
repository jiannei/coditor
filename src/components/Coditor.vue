<script setup>
import { ref, version } from 'vue'
import { commonmark, headingIdGenerator } from '@milkdown/preset-commonmark'
import { listener, listenerCtx } from '@milkdown/plugin-listener'
import { clipboard } from '@milkdown/plugin-clipboard'
import { placeholderConfig, placeholder as placeholderPlugin } from '@s2nc/milkdown-plugin-placeholder'
import { gfm } from '@milkdown/preset-gfm'
import { history } from '@milkdown/plugin-history'
import { indent } from '@milkdown/plugin-indent'
import { emoji } from '@milkdown/plugin-emoji'
import { cursor } from '@milkdown/plugin-cursor'
import { math } from '@milkdown/plugin-math'
import { shiki, shikiConfig } from '@s2nc/milkdown-plugin-shiki'
import { remoteUpload, remoteUploader } from '@s2nc/milkdown-plugin-upload'
import { defaultValueCtx, editorViewOptionsCtx } from '@milkdown/core'
import { nanoid } from '@milkdown/utils'
import { uploadConfig } from '@milkdown/plugin-upload'
import { Decoration } from '@milkdown/prose/view'
import { useDark, useFileDialog, useStorage, useToggle } from '@vueuse/core'
import { CoditorContainer, CoditorToobarItem, CoditorToorbar } from '@'
import 'prosemirror-view/style/prosemirror.css'
import 'prosemirror-tables/style/tables.css'
import '@/assets/css/editor.css'
import 'katex/dist/katex.min.css'
import MilkdownEditor from '@/components/MilkdownEditor.vue'

const { id, readonly, placeholder, hightlight } = defineProps({
  id: {
    type: String,
    default: 'coditor',
  },
  toolbar: {
    type: Array,
    default: () => [],
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: '',
  },
  hightlight: {
    type: Object,
    default: () => {},
  },
})

const editor = ref()

const headings = ref([])
const content = defineModel('content', { default: '' })

const plugin = ref([
  commonmark,
  listener,
  clipboard,
  placeholderPlugin,
  gfm,
  history,
  indent,
  emoji,
  shiki,
  remoteUpload,
  cursor,
  math,
])

const storage = useStorage(id, '')

function config(ctx) {
  ctx.update(editorViewOptionsCtx, (prev) => {
    return {
      ...prev,
      attributes: {
        class: 'min-h-[24rem] max-w-none prose prose-slate dark:prose-invert outline-none',
      },
      editable: () => !readonly,
    }
  })

  ctx.set(defaultValueCtx, !readonly ? storage.value : content.value)

  // 内容监听
  ctx.get(listenerCtx).markdownUpdated((ctx, markdown) => {
    content.value = markdown

    if (!readonly)
      storage.value = markdown
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

  ctx.set(placeholderConfig.key, placeholder)

  ctx.set(shikiConfig.key, hightlight)

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

const isDark = useDark({ storageKey: 'theme' })

const toggleDark = useToggle(isDark)
</script>

<template>
  <CoditorContainer class="w-full relative">
    <div class="sticky top-0 z-50 w-full bg-slate-100 dark:bg-slate-800 px-2 py-1.5 flex items-center justify-between">
      <CoditorToorbar :toolbar="toolbar" class="flex items-center space-x-1.5">
        <CoditorToobarItem v-slot="{ item }" @click="call">
          <button type="button" class="inline-flex items-center bg-transparent p-2 hover:bg-white dark:hover:bg-slate-900 rounded-md hover:shadow-sm cursor-pointer group">
            <span class="inline-block w-4 h-4 text-slate-7 dark:text-slate-2 group-hover:text-cyan-500" :class="`i-tabler:${item.icon}`" />
          </button>
        </CoditorToobarItem>
      </CoditorToorbar>

      <ul class="flex items-center space-x-3">
        <li class="inline-flex items-center cursor-pointer hover:bg-white dark:hover:bg-slate-900 p-1.5 rounded-full group hover:shadow-sm" @click="toggleDark()">
          <span class="w-4 h-4 inline-block text-slate-7 dark:text-slate-2 group-hover:text-cyan-500" :class="{ 'i-tabler:sun': !isDark, ' i-tabler:moon-stars': isDark }" />
        </li>
        <li class="inline-flex items-center cursor-pointer hover:bg-white dark:hover:bg-slate-900 p-1.5 rounded-full group hover:shadow-sm">
          <a class="w-4 h-4 inline-block i-tabler-brand-github text-slate-7 dark:text-slate-2 group-hover:text-cyan-500" href="https://github.com/jiannei/coditor" target="_blank" />
        </li>
        <li class="inline-flex items-center space-x-1">
          <span class="w-4 h-4 inline-block i-tabler-brand-vue text-green-5" />
          <span class="group">
            <a href="https://cn.vuejs.org/guide/introduction.html" target="_blank" class="text-sm text-slate-7 dark:text-slate-2 group-hover:text-cyan-500 hover:underline underline-offset-2 decoration-cyan-500 ">{{ version }}</a>
          </span>
        </li>
        <li class="inline-flex items-center space-x-1">
          <span class="w-5 h-5 inline-block i-snc-milkdown" />
          <span class="group">
            <a href="https://milkdown.dev" target="_blank" class="text-sm text-slate-7 dark:text-slate-2 group-hover:text-cyan-500 hover:underline underline-offset-2 decoration-cyan-500 ">7.3.3</a>
          </span>
        </li>
      </ul>
    </div>

    <MilkdownEditor ref="editor" :config="config" :plugin="plugin" />
  </CoditorContainer>
</template>
