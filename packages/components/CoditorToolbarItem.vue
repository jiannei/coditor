<script setup>
import { inject } from 'vue'

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
const emit = defineEmits(['click'])

const callCommand = inject('callCommand')
</script>

<template>
  <component :is="as" @mouseup="emit('click', command, callCommand)" @mousedown.prevent>
    <slot />
  </component>
</template>
