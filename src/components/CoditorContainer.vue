<script setup>
import { provide, ref } from 'vue'

const command = ref()
function call(cmd, payload) {
  command.value = { command: cmd, payload }
}

provide('command', command)
</script>

<template>
  <div>
    <slot :call="call" />
  </div>
</template>
