<script setup lang="ts">
import { MilkdownProvider } from '@milkdown/vue'
</script>

<template>
  <div>
    <MilkdownProvider>
      <slot />
    </MilkdownProvider>
  </div>
</template>
