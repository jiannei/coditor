<script setup>
import { MilkdownProvider } from '@milkdown/vue'
import { inject, ref, watch } from 'vue'
import MilkdownEditor from './MilkdownEditor.vue'

defineProps({
  plugins: {
    type: Array,
    default: () => [],
  },
})

const editor = ref()

// 监听 cmd 变化
watch(inject('command'), ({ command, payload }) => editor.value.callCommand(command, payload))
</script>

<template>
  <MilkdownProvider>
    <MilkdownEditor ref="editor" :plugins="plugins" />
  </MilkdownProvider>
</template>
