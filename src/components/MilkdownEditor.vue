<script setup>
import { Milkdown, useEditor } from '@milkdown/vue'
import { Editor, commandsCtx, rootCtx } from '@milkdown/core'

const { plugin, config } = defineProps({
  plugin: {
    type: Array,
    required: true,
  },
  config: {
    type: Function,
    required: true,
  },
})

const { get, loading } = useEditor((root) => {
  return Editor.make()
    .config(ctx => ctx.set(rootCtx, root))
    .config(config)
    .use(plugin)
})

function isLoading() {
  return loading.value
}

function call(command, payload) {
  get().action(ctx => ctx.get(commandsCtx).call(command, payload))
}

defineExpose({ get, isLoading, call })
</script>

<template>
  <Milkdown />
</template>
