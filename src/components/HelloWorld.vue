<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-2xl text-slate-500">
      {{ msg }}
    </h1>

    <button class="text-white bg-cyan-500 px-2 py-1 rounded-md" type="button" @click="count++">
      count is {{ count }}
    </button>
  </div>
</template>
