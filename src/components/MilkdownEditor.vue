<script setup>
import { Milkdown, useEditor } from '@milkdown/vue'
import { watchEffect } from 'vue'

const { getEditor } = defineProps({
  getEditor: {
    type: Function,
    required: true,
  },
})

const emit = defineEmits(['loading'])

const { get, loading } = useEditor(getEditor)

watchEffect(() => {
  emit('loading', loading.value)
})

defineExpose({ get })
</script>

<template>
  <Milkdown />
</template>
