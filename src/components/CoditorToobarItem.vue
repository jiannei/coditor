<script setup>
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
</script>

<template>
  <component :is="as" @mouseup="emit('click', command)" @mousedown.prevent>
    <slot />
  </component>
</template>
