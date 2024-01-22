<script setup>
defineProps({
  toolbar: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <div v-if="toolbar?.length">
    <slot />
  </div>
</template>
