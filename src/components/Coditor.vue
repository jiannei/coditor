<script setup>
import { MilkdownProvider } from '@milkdown/vue'
import { ref } from 'vue'
import { commandsCtx } from '@milkdown/core'
import MilkdownEditor from './MilkdownEditor.vue'

defineProps({
  getEditor: {
    type: Function,
    required: true,
  },
})

const editorRef = ref()

function get() {
  return editorRef.value.get()
}

function call(command, payload) {
  editorRef.value.get().action(ctx => ctx.get(commandsCtx).call(command, payload))
}

defineExpose({ get, call })
</script>

<template>
  <MilkdownProvider>
    <MilkdownEditor ref="editorRef" :get-editor="getEditor" />
  </MilkdownProvider>
</template>
