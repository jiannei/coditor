<script setup>
import { Milkdown, useEditor } from '@milkdown/vue'

const { getEditor } = defineProps({
  getEditor: {
    type: Function,
    required: true,
  },
})

const { get } = useEditor(getEditor)

defineExpose({ get })
</script>

<template>
  <Milkdown />
</template>
