<script setup>
import { MilkdownProvider } from '@milkdown/vue'
import { computed, inject, ref, watch } from 'vue'
import { defaultValueCtx, editorViewOptionsCtx } from '@milkdown/core'
import { listenerCtx } from '@milkdown/plugin-listener'
import MilkdownEditor from './MilkdownEditor.vue'

const { readonly, plugins } = defineProps({
  plugins: {
    type: Array,
    default: () => [],
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})

const editor = ref()

// 监听 cmd 变化
watch(inject('command'), ({ command, payload }) => editor.value.callCommand(command, payload))

const content = defineModel('content', { default: '' })

// configs = 默认配置 + 传入配置
const configs = computed(() => [{
  config: (ctx) => {
    // 编辑模式
    ctx.update(editorViewOptionsCtx, prev => ({
      ...prev,
      editable: () => !readonly,
    }))

    // 默认内容
    ctx.set(defaultValueCtx, content.value)

    // 内容监听
    ctx.get(listenerCtx).markdownUpdated((ctx, markdown) => {
      content.value = markdown
    })
  },
}, ...plugins])
</script>

<template>
  <MilkdownProvider>
    <MilkdownEditor ref="editor" :configs="configs" />
  </MilkdownProvider>
</template>
