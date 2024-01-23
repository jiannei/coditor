<script setup>
import { provide, ref } from 'vue'

const command = ref()

provide('command', command)
provide('callCommand', (cmd, payload) => command.value = { command: cmd, payload })
</script>

<template>
  <div>
    <slot />
  </div>
</template>
