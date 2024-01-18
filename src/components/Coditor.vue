<script setup>
import { MilkdownProvider } from '@milkdown/vue'
import { Base64 } from 'js-base64'
import { ref } from 'vue'
import { useFileDialog } from '@vueuse/core'
import { defaultValueCtx, editorViewOptionsCtx, rootCtx } from '@milkdown/core'
import { callCommand } from '@milkdown/utils'
import { listenerCtx } from '@milkdown/plugin-listener'
import Editor from './MilkdownEditor.vue'
import 'prosemirror-view/style/prosemirror.css'
import 'prosemirror-tables/style/tables.css'
import '@/../css/editor.css'

const props = defineProps({
  classes: {
    type: String,
    default: '',
  },
  toolbar: {
    type: Array,
    default: () => [],
  },
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
  }, // 插件配置
  plugins: {
    type: Array,
    default: () => [],
  },
  config: {
    type: Function,
    default: () => {},
  },
})

const emit = defineEmits(['update:content', 'update:headings'])

// const cacheStorage = cache ? useStorage(`editor${id ? `-${id}` : ''}`, '') : ref('')

const editor = ref()
const { open, onChange } = useFileDialog({ accept: 'image/*' })

function runCommand(cmd) {
  if (cmd === 'RemoteUpload') {
    open()
    return
  }

  editor.value.get().action(callCommand(cmd))
}

onChange((files) => {
  // 传入远程上传回调到 command
  editor.value.get().action(callCommand('RemoteUpload', files))
})

const editable = () => !props.readonly

function config(root) {
  return {
    plugins: props.plugins,
    callback: (ctx) => {
      // 初始化
      ctx.set(rootCtx, root)

      // 编辑模式
      ctx.update(editorViewOptionsCtx, prev => ({
        ...prev,
        editable,
      }))

      // 默认内容
      ctx.set(defaultValueCtx, Base64.decode(props.content))

      // 监听内容更新
      ctx.get(listenerCtx).markdownUpdated((ctx, markdown) => {
        // if (cache)
        // cacheStorage.value = content

        emit('update:content', Base64.encode(markdown))
      })

      props.config(ctx)
    },
  }
}
</script>

<template>
  <MilkdownProvider>
    <div :class="classes">
      <slot name="header" />

      <Editor ref="editor" :config="config" />

      <slot name="footer" />
    </div>
  </MilkdownProvider>
</template>
