<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import Coditor from '@/components/Coditor.vue'
import usePoem from '@/hooks/usePoem.js'

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

watch(content, value => console.log(value))

const hightlight = reactive({
  themes: { light: 'dracula', dark: 'dracula-soft' },
  langs: ['bash', 'c', 'css', 'go', 'html', 'java', 'javascript', 'js', 'json', 'markdown', 'php', 'python', 'sql', 'sh', 'rust', 'vue'],
  dark: false,
})

const poem = ref('')

onMounted(() => {
  usePoem().load((response) => {
    poem.value = response.data.content
    console.log(poem.value)
  })
})
</script>

<template>
  <div class="h-dvh flex items-center justify-center bg-stone-100 dark:bg-slate-800">
    <div class="max-w-6xl mx-auto w-full">
      <Coditor v-model:content="content" :toolbar="toolbar" :hightlight="hightlight" placeholder="今天准备分享什么呢" />
    </div>
  </div>
</template>
