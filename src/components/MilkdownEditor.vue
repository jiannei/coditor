<script setup>
import { Milkdown, useEditor } from '@milkdown/vue'
import { Editor, editorViewOptionsCtx, rootCtx } from '@milkdown/core'
import { commonmark } from '@milkdown/preset-commonmark'
import { callCommand, replaceAll } from '@milkdown/utils'
import { listener } from '@milkdown/plugin-listener'
import { clipboard } from '@milkdown/plugin-clipboard'
import { gfm } from '@milkdown/preset-gfm'
import { history } from '@milkdown/plugin-history'
import { indent } from '@milkdown/plugin-indent'
import { emoji } from '@milkdown/plugin-emoji'
import { shiki } from '@s2nc/milkdown-plugin-shiki'
import { placeholder as placeholderPlugin } from '@s2nc/milkdown-plugin-placeholder'
import { remoteUpload } from '@s2nc/milkdown-plugin-upload'

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
  return Editor.make()
    .config(milk)
    .config(config)
    .config((ctx) => {
      // 编辑器初始化配置
      ctx.set(rootCtx, root)
    })
    .use([
      commonmark,
      listener,
      clipboard,
      gfm,
      history,
      indent,
      emoji,
      remoteUpload,
      shiki,
      placeholderPlugin,
    ])
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
