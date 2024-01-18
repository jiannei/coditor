<script setup>
import { Milkdown, useEditor } from '@milkdown/vue'
import { Editor, editorViewOptionsCtx } from '@milkdown/core'
import { callCommand, replaceAll } from '@milkdown/utils'

import 'prosemirror-view/style/prosemirror.css'
import 'prosemirror-tables/style/tables.css'
import '../assets/css/editor.css'

import { watch } from 'vue'

const { height, success, config } = defineProps({
  height: {
    type: String,
    default: 'full',
  },
  success: {
    type: Boolean,
    default: false,
  },
  config: {
    type: Function,
    required: true,
  },
})

function milk(ctx) {
  ctx.update(editorViewOptionsCtx, (prev) => {
    return {
      ...prev,
      attributes: {
        class: `${height !== 'full' ? `min-h-[${height}]` : ''} max-w-none prose prose-slate dark:prose-invert outline-none`,
      },
    }
  })
}

const { loading, get } = useEditor((root) => {
  const { configCallback, plugins } = config(root)

  return Editor.make()
    .config(milk)
    .config(configCallback)
    .use(plugins)
})

// 清除缓存
watch(() => success, (val) => {
  if (!val)
    return

  get().action((ctx) => {
    replaceAll('')(ctx)
  })
})

function runCommand(key, payload) {
  if (loading.value)
    return

  get().action(callCommand(key, payload))
}

defineExpose({ runCommand })
</script>

<template>
  <Milkdown />
</template>
