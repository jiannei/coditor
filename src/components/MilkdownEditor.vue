<script setup>
import { Milkdown, useEditor } from '@milkdown/vue'
import { Editor, commandsCtx, rootCtx } from '@milkdown/core'
import { commonmark } from '@milkdown/preset-commonmark'
import { listener } from '@milkdown/plugin-listener'

const { configs } = defineProps({
  configs: {
    type: Array,
    default: () => [],
  },
})

const { loading, get } = useEditor((root) => {
  return Editor.make()
    .config(ctx => ctx.set(rootCtx, root))
    .config(ctx => configs.map(item => item.config).filter(item => item).forEach(item => item(ctx)))
    .use([commonmark, listener])
    .use(configs.map(item => item.plugin).filter(item => item))
})

function callCommand(cmd, payload) {
  if (loading.value)
    return false

  return get().action(ctx => ctx.get(commandsCtx).call(cmd, payload))
}

defineExpose({ callCommand })
</script>

<template>
  <Milkdown />
</template>
