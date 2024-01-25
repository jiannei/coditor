<script setup>
import { MilkdownProvider } from '@milkdown/vue'
import { ref } from 'vue'
import { commandsCtx } from '@milkdown/core'
import MilkdownEditor from './MilkdownEditor.vue'

defineProps({
  plugin: {
    type: Array,
    required: true,
  },
  config: {
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

function loading() {
  return editorRef.value.isLoading()
}

defineExpose({ get, call, loading })
</script>

<template>
  <MilkdownProvider>
    <MilkdownEditor ref="editorRef" :plugin="plugin" :config="config" />
  </MilkdownProvider>
</template>
