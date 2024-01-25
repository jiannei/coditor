<script setup>
import { ref, watchEffect } from 'vue'
import Coditor from '@/components/Coditor.vue'

const toolbar = ref([
  { icon: 'bold', command: 'ToggleStrong' },
  { icon: 'italic', command: 'ToggleEmphasis' },
  { icon: 'strikethrough', command: 'ToggleStrikeThrough' },
  { icon: 'braces', command: 'ToggleInlineCode' },
  { icon: 'code', command: 'CreateCodeBlock' },
  { icon: 'quote', command: 'WrapInBlockquote' },
  { icon: 'separator', command: 'InsertHr' },
  { icon: 'text-wrap', command: 'InsertHardbreak' },
  { icon: 'photo', command: 'RemoteUpload' },
  { icon: 'arrow-back-up', command: 'Undo' },
  { icon: 'arrow-forward-up', command: 'Redo' },
])

const content = ref('')

watchEffect(() => console.log(content.value))
</script>

<template>
  <div class="h-dvh flex items-center justify-center bg-stone-100 dark:bg-slate-800">
    <div class="max-w-6xl mx-auto w-full">
      <Coditor v-model:content="content" :toolbar="toolbar" />
    </div>
  </div>
</template>
