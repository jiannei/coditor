<script setup>
import { Milkdown, useEditor } from '@milkdown/vue'
import { Editor, commandsCtx, rootCtx } from '@milkdown/core'
import { commonmark } from '@milkdown/preset-commonmark'

const { plugins } = defineProps({
  plugins: {
    type: Array,
    default: () => [],
  },
})

const { loading, get } = useEditor((root) => {
  return Editor.make()
    .config((ctx) => {
      ctx.set(rootCtx, root)
    })
    .config(ctx => plugins.map(item => item.config).filter(item => item).forEach(item => item(ctx)))
    .use(commonmark)
    .use(plugins.map(item => item.plugin).filter(item => item))
})

function callCommand(cmd, payload) {
  if (loading.value)
    return false

  return get().action(ctx => ctx.get(commandsCtx).call(cmd, payload))
}

defineExpose({ callCommand, get })
</script>

<template>
  <Milkdown />
</template>
