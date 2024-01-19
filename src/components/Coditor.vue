<script setup>
import { MilkdownProvider } from '@milkdown/vue'
import { computed, inject, ref, watch } from 'vue'
import { useFileDialog } from '@vueuse/core'
import { headingIdGenerator } from '@milkdown/preset-commonmark'
import { nanoid } from '@milkdown/utils'
import { defaultValueCtx, editorViewOptionsCtx } from '@milkdown/core'
import { listenerCtx } from '@milkdown/plugin-listener'
import MilkdownEditor from './MilkdownEditor.vue'

const { cache, readonly, success, plugins } = defineProps({
  plugins: {
    type: Array,
    default: () => [],
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
})

const editor = ref()
const { open, onChange } = useFileDialog({ accept: 'image/*' })

// 监听 cmd 变化
watch(inject('cmd'), value => callCommand(value))

function callCommand(cmd, payload) {
  if (cmd === 'RemoteUpload' && !payload) {
    open()
    return
  }

  editor.value.callCommand(cmd, payload)
}

onChange(files => callCommand('RemoteUpload', files))

const content = defineModel('content', { default: '' })

const headings = []

// configs = 默认配置 + 传入配置
const configs = computed(() => {
  plugins.push({
    config: (ctx) => {
      // 编辑模式
      ctx.update(editorViewOptionsCtx, prev => ({
        ...prev,
        editable: () => !readonly,
      }))

      // 默认内容
      ctx.set(defaultValueCtx, content.value)

      // heading id
      ctx.set(headingIdGenerator.key, (node) => {
        let id = node.attrs.id

        if (!id)
          id = nanoid()

        headings.push({
          text: node.textContent,
          level: node.attrs.level,
          id,
        })

        return id
      })

      // 内容监听
      ctx.get(listenerCtx).markdownUpdated((ctx, markdown) => {
        content.value = markdown
      })
    },
  })

  return plugins
})

function getHeadings() {
  return headings
}

defineExpose({ getHeadings })
</script>

<template>
  <MilkdownProvider>
    <MilkdownEditor ref="editor" :configs="configs" />
  </MilkdownProvider>
</template>
