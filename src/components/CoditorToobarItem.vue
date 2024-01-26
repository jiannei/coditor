<script setup>
import { inject } from 'vue'

defineProps({
  as: {
    type: String,
    default: 'li',
  },
})
const emit = defineEmits(['click'])

const toolbar = inject('toolbar')
</script>

<template>
  <component :is="as" v-for="(item, key) in toolbar" :key="key" @mouseup="emit('click', item.command)" @mousedown.prevent>
    <slot :item="item" />
  </component>
</template>
