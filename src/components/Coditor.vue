<script setup>
import { MilkdownProvider } from '@milkdown/vue'
import { inject, ref, watch } from 'vue'
import MilkdownEditor from './MilkdownEditor.vue'

defineProps({
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
</script>

<template>
  <MilkdownProvider>
    <MilkdownEditor ref="editor" :readonly="readonly" :content="content" :classes="classes" :configs="plugins" />
  </MilkdownProvider>
</template>
