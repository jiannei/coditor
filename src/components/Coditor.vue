<script setup>
import { MilkdownProvider } from '@milkdown/vue'
import { ref } from 'vue'
import { useDark, useFileDialog } from '@vueuse/core'
import { shiki, shikiConfig } from '@s2nc/milkdown-plugin-shiki'
import { commonmark } from '@milkdown/preset-commonmark'
import { placeholderConfig, placeholder as placeholderPlugin } from '@s2nc/milkdown-plugin-placeholder'
import { listener, listenerCtx } from '@milkdown/plugin-listener'
import { remoteUpload, remoteUploadConfig, remoteUploader } from '@s2nc/milkdown-plugin-upload'
import { uploadConfig } from '@milkdown/plugin-upload'
import { Decoration } from '@milkdown/prose/view'
import { clipboard } from '@milkdown/plugin-clipboard'
import { gfm } from '@milkdown/preset-gfm'
import { history } from '@milkdown/plugin-history'
import { indent } from '@milkdown/plugin-indent'
import { emoji } from '@milkdown/plugin-emoji'
import Editor from 'MilkdownEditor.vue'
import useImageUpload from '@/Hooks/useImageUpload.js'
import 'prosemirror-view/style/prosemirror.css'
import 'prosemirror-tables/style/tables.css'
import '@/../css/editor.css'
import { defaultValueCtx, editorViewOptionsCtx } from '@milkdown/core'
import { Base64 } from 'js-base64'

const props = defineProps({
  content: {
    type: String,
    default: '',
  },
  cache: {
    type: Boolean,
    default: true,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  success: {
    type: Boolean,
    default: false,
  },
  plugins: {
    type: Array,
    default: () => [],
  }, // 下面移除
  toolbar: {
    type: Array,
    default: () => [],
  },
  headings: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: 'Share something...',
  },
  upload: {
    type: Object,
    default: () => {
    },
  },
})

const emit = defineEmits(['update:content', 'update:headings'])

const editor = ref()

const { open, onChange } = useFileDialog({ accept: 'image/*' })

function callCommand(cmd, payload) {
  if (cmd === 'RemoteUpload' && !payload) {
    open()
    return
  }

  editor.value.callCommand(cmd, payload)
}

onChange(files => callCommand('RemoteUpload', files))

const isDark = useDark({ storageKey: 'theme' })

const configs = ref([
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
  { config: (ctx) => {
    // 编辑模式
    ctx.update(editorViewOptionsCtx, prev => ({
      ...prev,
      editable: () => !props.readonly,
    }))

    // 默认内容
    ctx.set(defaultValueCtx, Base64.decode(props.content))

    // 内容监听
    ctx.get(listenerCtx).markdownUpdated((ctx, markdown) => {
      console.log('markdown', markdown)
      emit('update:content', Base64.encode(markdown))
    })
  } },
  // 插件配置
  { plugin: commonmark },
  { plugin: listener }, // 只读模式不需要
  { plugin: clipboard }, // 只读模式不需要
  { plugin: gfm },
  { plugin: history }, // 只读模式不需要
  { plugin: indent },
  { plugin: emoji },
  { plugin: remoteUpload, config: (ctx) => {
    ctx.set(remoteUploadConfig.key, files => useImageUpload(props.upload.url, files))
    ctx.update(uploadConfig.key, (prev) => {
      return {
        ...prev,
        uploader: remoteUploader(ctx),
        uploadWidgetFactory: (pos, spec) => {
          const widgetDOM = document.createElement('span')
          widgetDOM.classList.add(...props.upload.loading)

          return Decoration.widget(pos, widgetDOM, spec)
        },
      }
    })
  } }, // 只读模式不需要
  { plugin: shiki, config: ctx => ctx.set(shikiConfig.key, {
    themes: { light: 'dracula', dark: 'dracula-soft' },
    langs: ['bash', 'c', 'css', 'go', 'html', 'java', 'javascript', 'js', 'json', 'markdown', 'php', 'python', 'sql', 'sh', 'rust'],
    dark: isDark.value,
  }) },
  { plugin: placeholderPlugin, config: ctx => ctx.set(placeholderConfig.key, props.placeholder) }, // 只读模式不需要
])
</script>

<template>
  <div>
    <!-- header -->
    <slot name="header" :call-command="callCommand" />

    <!-- editor -->
    <MilkdownProvider>
      <Editor ref="editor" :configs="configs" />
    </MilkdownProvider>

    <!-- footer -->
    <slot :call-command="callCommand" />
  </div>
</template>
