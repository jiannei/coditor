<script setup>
import { MilkdownProvider } from '@milkdown/vue'
import { computed, inject, ref, watch } from 'vue'
import { defaultValueCtx, editorViewOptionsCtx } from '@milkdown/core'
import MilkdownEditor from './MilkdownEditor.vue'

const { readonly, plugins, content } = defineProps({
  plugins: {
    type: Array,
    default: () => [],
  },
  content: {
    type: String,
    default: '',
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})

const editor = ref()

// 监听 cmd 变化
watch(inject('command'), ({ command, payload }) => editor.value.callCommand(command, payload))

// configs = 默认配置 + 传入配置
const configs = computed(() => [{
  config: (ctx) => {
    // 编辑模式
    ctx.update(editorViewOptionsCtx, prev => ({
      ...prev,
      editable: () => !readonly,
    }))

    // 默认内容
    ctx.set(defaultValueCtx, content)
  },
}, ...plugins])
</script>

<template>
  <MilkdownProvider>
    <MilkdownEditor ref="editor" :configs="configs" />
  </MilkdownProvider>
</template>
