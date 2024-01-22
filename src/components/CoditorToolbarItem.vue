<script setup>
import { inject, ref } from 'vue'

defineProps({
  command: {
    type: String,
    required: true,
  },
})
const emit = defineEmits(['call'])

const callCommand = inject('callCommand')

const callback = ref()
</script>

<template>
  <button type="button" @mouseup="emit('call', command, callback)" @mousedown.prevent="callback = callCommand">
    <slot :callback="callback" />
  </button>
</template>
