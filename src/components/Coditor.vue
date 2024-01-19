<script setup>
import { MilkdownProvider } from '@milkdown/vue'
import { computed, ref } from 'vue'
import { useFileDialog } from '@vueuse/core'
import { headingIdGenerator } from '@milkdown/preset-commonmark'
import { nanoid } from '@milkdown/utils'
import { defaultValueCtx, editorViewOptionsCtx } from '@milkdown/core'
import { Base64 } from 'js-base64'
import { listenerCtx } from '@milkdown/plugin-listener'
import Editor from './MilkdownEditor.vue'

import 'prosemirror-view/style/prosemirror.css'
import 'prosemirror-tables/style/tables.css'
import '../assets/css/editor.css'

const { configs, cache, readonly, success } = defineProps({
  configs: {
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
const pluginConfigs = computed(() => {
  const cfgs = configs

  cfgs.push(
    // 主题
    { config: (ctx) => {
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
        editable: () => !readonly,
      }))

      // 默认内容
      ctx.set(defaultValueCtx, Base64.decode(content.value))

      // heading id
      ctx.set(headingIdGenerator.key, (node) => {
        if (node.attrs.id)
          return node.attrs.id // 防止内存溢出

        const id = nanoid()

        headings.push({
          text: node.textContent,
          level: node.attrs.level,
          id,
        })

        return id
      })

      // 内容监听
      ctx.get(listenerCtx).markdownUpdated((ctx, markdown) => {
        console.log('markdown', markdown)

        content.value = Base64.encode(markdown)
      })
    } },
  )

  return cfgs
})

function getHeadings() {
  return headings
}

defineExpose({ getHeadings })
</script>

<template>
  <div>
    <!-- header -->
    <slot name="header" :call-command="callCommand" />

    <!-- editor -->
    <MilkdownProvider>
      <Editor ref="editor" :configs="pluginConfigs" />
    </MilkdownProvider>

    <!-- footer -->
    <slot :call-command="callCommand" />
  </div>
</template>
