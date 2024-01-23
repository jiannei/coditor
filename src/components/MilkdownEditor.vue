<script setup>
import { Milkdown, useEditor } from '@milkdown/vue'
import { Editor, commandsCtx, editorViewOptionsCtx, rootCtx } from '@milkdown/core'

const { configs, readonly, classes } = defineProps({
  configs: {
    type: Array,
    default: () => [],
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  classes: {
    type: String,
    default: '',
  },
})

const { loading, get } = useEditor((root) => {
  return Editor.make()
    .config((ctx) => {
      ctx.set(rootCtx, root)

      ctx.update(editorViewOptionsCtx, (prev) => {
        return {
          ...prev,
          attributes: {
            class: classes,
          },
          editable: () => !readonly,
        }
      })
    })
    .config(ctx => configs.map(item => item.config).filter(item => item).forEach(item => item(ctx)))
    .use(configs.map(item => item.plugin).filter(item => item))
})

function callCommand(cmd, payload) {
  if (loading.value)
    return false

  return get().action(ctx => ctx.get(commandsCtx).call(cmd, payload))
}

defineExpose({ callCommand })
</script>

<template>
  <Milkdown />
</template>
