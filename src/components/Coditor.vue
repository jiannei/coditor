<script setup>
import { MilkdownProvider } from '@milkdown/vue'
import { ref } from 'vue'
import { Editor, commandsCtx, rootCtx } from '@milkdown/core'
import { commonmark } from '@milkdown/preset-commonmark'
import MilkdownEditor from './MilkdownEditor.vue'

const { plugins } = defineProps({
  plugins: {
    type: Array,
    default: () => [],
  },
})

const editorRef = ref()

function get() {
  return editorRef.value.get()
}

function getEditor(root) {
  return Editor.make()
    .config(ctx => ctx.set(rootCtx, root))
    .config(ctx => plugins.map(item => item.config).filter(item => item).forEach(item => item(ctx)))
    .use(commonmark)
    .use(plugins.map(item => item.plugin).filter(item => item))
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
