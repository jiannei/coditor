<script setup>
import { provide, ref } from 'vue'

const cmd = ref('')
function call(command) {
  cmd.value = command
}

provide('cmd', cmd)
</script>

<template>
  <div>
    <slot :call="call" />
  </div>
</template>
