<script setup>
import { Milkdown, useEditor } from '@milkdown/vue'
import { Editor, rootCtx } from '@milkdown/core'

const { configs } = defineProps({
  configs: {
    type: Array,
    default: () => [],
  },
})

const { get } = useEditor((root) => {
  return Editor.make()
    .config(ctx => ctx.set(rootCtx, root))
    .config(ctx => configs.map(item => item.config).filter(item => item).forEach(item => item(ctx)))
    .use(configs.map(item => item.plugin).filter(item => item))
})

defineExpose({ get })
</script>

<template>
  <Milkdown />
</template>
