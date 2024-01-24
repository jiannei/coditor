<script setup>
import { Milkdown, useEditor } from '@milkdown/vue'
import { Editor, defaultValueCtx, editorViewOptionsCtx, rootCtx } from '@milkdown/core'
import { commonmark } from '@milkdown/preset-commonmark'
import { listener, listenerCtx } from '@milkdown/plugin-listener'
import { clipboard } from '@milkdown/plugin-clipboard'
import { placeholder, placeholderConfig } from '@s2nc/milkdown-plugin-placeholder'
import { gfm } from '@milkdown/preset-gfm'
import { history } from '@milkdown/plugin-history'
import { indent } from '@milkdown/plugin-indent'
import { emoji } from '@milkdown/plugin-emoji'
import { remoteUpload } from '@s2nc/milkdown-plugin-upload'
import { upload } from '@milkdown/plugin-upload'
import { ref, watchEffect } from 'vue'

const { plugins } = defineProps({
  plugins: {
    type: Array,
    default: () => [],
  },
})

const content = ref('')

const { get, loading } = useEditor((root) => {
  return Editor.make()
    .config((ctx) => {
      ctx.set(rootCtx, root)

      ctx.update(editorViewOptionsCtx, (prev) => {
        return {
          ...prev,
          editable: () => true,
        }
      })

      ctx.set(defaultValueCtx, content.value)

      // 内容监听
      ctx.get(listenerCtx).markdownUpdated((ctx, markdown) => {
        content.value = markdown
      })

      ctx.set(placeholderConfig.key, '开始分享你的故事～')
    })
    .use([commonmark, listener, clipboard, placeholder, gfm, history, indent, emoji, remoteUpload, upload])
})

function isLoading() {
  return loading.value
}

watchEffect(async () => {
  if (!loading.value) {
    console.log('loading')
    const editor = get()

    plugins.forEach((plugin) => {
      editor.config(plugin)
    })

    await get().create()
  }
})

defineExpose({ get, isLoading })
</script>

<template>
  <Milkdown />
</template>
