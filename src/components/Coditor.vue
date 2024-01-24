<script setup>
import { MilkdownProvider } from '@milkdown/vue'
import { ref } from 'vue'
import MilkdownEditor from './MilkdownEditor.vue'

defineProps({
  plugins: {
    type: Array,
    default: () => [],
  },
})

const editorRef = ref()

function get() {
  return editorRef.value.get()
}

defineExpose({ get })
</script>

<template>
  <MilkdownProvider>
    <MilkdownEditor ref="editorRef" :plugins="plugins" />
  </MilkdownProvider>
</template>
