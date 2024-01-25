<script setup>
import { Milkdown, useEditor } from '@milkdown/vue'
import { Editor, rootCtx } from '@milkdown/core'

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

defineExpose({ get, isLoading })
</script>

<template>
  <Milkdown />
</template>
