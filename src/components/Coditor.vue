<script setup>
import { MilkdownProvider } from '@milkdown/vue'
import { ref } from 'vue'
import { commandsCtx } from '@milkdown/core'
import { placeholder, placeholderConfig } from '@s2nc/milkdown-plugin-placeholder'
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

async function loading(val) {
  if (!val) {
    const editor = editorRef.value.get()
    console.log(editor)
    editorRef.value.get().use(placeholder).config(ctx => ctx.set(placeholderConfig.key, '开始分享你的故事～'))

    await editor.create()
  }
}

defineExpose({ get, call })
</script>

<template>
  <MilkdownProvider>
    <MilkdownEditor ref="editorRef" :get-editor="getEditor" @loading="loading" />
  </MilkdownProvider>
</template>
