<script setup>
defineProps({
  toolbar: {
    type: Array,
    required: true,
  },
  as: {
    type: String,
    default: 'ul',
  },
})
</script>

<template>
  <component :is="as" v-if="toolbar?.length">
    <slot />
  </component>
</template>
