<script setup>
import { MilkdownProvider } from '@milkdown/vue'
import { computed, inject, ref, watch } from 'vue'
import { defaultValueCtx } from '@milkdown/core'
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
  classes: {
    type: String,
    default: '',
  },
})

const editor = ref()

// 监听 cmd 变化
watch(inject('command'), ({ command, payload }) => editor.value.callCommand(command, payload))

// configs = 默认配置 + 传入配置
const configs = computed(() => [{
  config: (ctx) => {
    // 默认内容
    ctx.set(defaultValueCtx, content)
  },
}, ...plugins])
</script>

<template>
  <MilkdownProvider>
    <MilkdownEditor ref="editor" :readonly="readonly" :classes="classes" :configs="configs" />
  </MilkdownProvider>
</template>
