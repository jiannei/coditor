<script setup>
import { Milkdown, useEditor } from '@milkdown/vue'
import { Editor, defaultValueCtx, editorViewOptionsCtx, rootCtx } from '@milkdown/core'
import { listenerCtx } from '@milkdown/plugin-listener'

const { height, content, plugins, readonly } = defineProps({
  plugins: {
    type: Array,
    default: () => [],
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  height: { // todo 待移除
    type: String,
    default: 'full',
  },
  content: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:content'])

const { loading, get } = useEditor((root) => {
  return Editor.make().config((ctx) => {
    ctx.set(rootCtx, root)

    ctx.update(editorViewOptionsCtx, prev => ({
      ...prev,
      editable: () => !readonly,
    }))

    ctx.update(editorViewOptionsCtx, (prev) => {
      return {
        ...prev,
        attributes: {
          // todo 移除 height
          class: `${height !== 'full' ? `min-h-[${height}]` : ''} max-w-none prose prose-slate dark:prose-invert outline-none`,
        },
      }
    })

    ctx.set(defaultValueCtx, content)

    ctx.get(listenerCtx).markdownUpdated((ctx, markdown) => {
      emit('update:content', markdown)
    })

    plugins.map(item => item.config).filter(item => item).forEach(item => item(ctx))
  }).use(plugins.map(item => item.plugin))
})

defineExpose({ get })
</script>

<template>
  <Milkdown />
</template>
