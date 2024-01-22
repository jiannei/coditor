<script setup>
import { inject, ref } from 'vue'

defineProps({
  command: {
    type: String,
    required: true,
  },
  as: {
    type: String,
    default: 'li',
  },
})
const emit = defineEmits(['call'])

const callCommand = inject('callCommand')

const callback = ref()
</script>

<template>
  <component :is="as" @mouseup="emit('call', command, callback)" @mousedown.prevent="callback = callCommand">
    <slot />
  </component>
</template>
