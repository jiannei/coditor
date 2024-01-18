<script setup lang="ts">
import { Milkdown, useEditor } from '@milkdown/vue'
import { Editor } from '@milkdown/core'

const { config } = defineProps({
  config: {
    type: Function,
    required: true,
  },
})

const { get } = useEditor((root) => {
  const { callback, plugins } = config(root)

  return Editor.make().config(callback).use(plugins)
})

defineExpose({ get })
</script>

<template>
  <Milkdown />
</template>
