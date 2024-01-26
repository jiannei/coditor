<script setup>
import { provide } from 'vue'

const { toolbar } = defineProps({
  toolbar: {
    type: Array,
    required: true,
  },
  as: {
    type: String,
    default: 'ul',
  },
})

provide('toolbar', toolbar)
</script>

<template>
  <component :is="as" v-if="toolbar?.length">
    <slot />
  </component>
</template>
