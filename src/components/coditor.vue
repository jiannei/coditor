<script setup>
import { Milkdown, useEditor } from '@milkdown/vue'
import { Editor, defaultValueCtx, editorViewOptionsCtx, rootCtx } from '@milkdown/core'
import { commonmark, headingIdGenerator } from '@milkdown/preset-commonmark'
import { callCommand, nanoid, replaceAll } from '@milkdown/utils'
import { listener, listenerCtx } from '@milkdown/plugin-listener'
import { clipboard } from '@milkdown/plugin-clipboard'
import { gfm } from '@milkdown/preset-gfm'
import { history } from '@milkdown/plugin-history'
import { indent } from '@milkdown/plugin-indent'
import { Decoration } from '@milkdown/prose/view'
import { emoji } from '@milkdown/plugin-emoji'
import { shiki, shikiConfig } from '@s2nc/milkdown-plugin-shiki'
import { placeholderConfig, placeholder as placeholderPlugin } from '@s2nc/milkdown-plugin-placeholder'
import { remoteUpload, remoteUploadConfig, remoteUploader } from '@s2nc/milkdown-plugin-upload'
import { uploadConfig } from '@milkdown/plugin-upload'

import 'prosemirror-view/style/prosemirror.css'
import 'prosemirror-tables/style/tables.css'
import '../assets/css/editor.css'

import { ref, watch } from 'vue'

const { dark, readonly, height, placeholder, upload, content, headings, success } = defineProps({
  dark: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  height: {
    type: String,
    default: 'full',
  },
  placeholder: {
    type: String,
    default: 'Share something...',
  },
  upload: {
    type: Object,
    default: () => {},
  },
  content: {
    type: String,
    default: '',
  },
  headings: {
    type: Array,
    default: () => [],
  },
  success: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:content', 'update:headings'])

const editable = () => !readonly

const headingsRef = ref(headings)

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
      .config(milk) // 主题配置
      .config((ctx) => {
        // 设置开启编辑模式
        ctx.update(editorViewOptionsCtx, prev => ({
          ...prev,
          editable,
        }))

        // 编辑器初始化配置
        ctx.set(rootCtx, root)
        ctx.set(defaultValueCtx, content)
        // ctx.set(editorViewOptionsCtx, {editable});

        // 代码高亮
        ctx.set(shikiConfig.key, {
          themes: { light: 'dracula', dark: 'dracula-soft' },
          langs: ['bash', 'c', 'css', 'go', 'html', 'java', 'javascript', 'js', 'json', 'markdown', 'php', 'python', 'sql', 'sh', 'rust'],
          dark,
        })

        // 设置 heading id（复制 markdown，或者只读模式 defaultValue 为 markdown 渲染的 heading 没有id问题）
        ctx.set(headingIdGenerator.key, (node) => {
          if (node.attrs.id)
            return node.attrs.id // 防止内存溢出

          const id = nanoid()

          headingsRef.value.push({
            text: node.textContent,
            level: node.attrs.level,
            id,
          })

          return id
        })

        // 设置 placeholder
        ctx.set(placeholderConfig.key, placeholder)

        // 监听内容更新
        ctx.get(listenerCtx)
            .markdownUpdated((ctx, markdown) => {
              // if (!markdown) return// 空内容不提交事件
              // if (cache)
              // cacheStorage.value = content

              emit('update:content', markdown)
            })
            .mounted(() => {
              // emit('update:modelValue', defaultValue)
              emit('update:headings', headingsRef.value)

              // if (props.readonly) {
              // const headings  = outline()(ctx)
              // console.log(headings)

              // const html  = getHTML()(ctx)

              // console.log(html)

              // emit('update:headings', headings)
              // }
            })

        // upload 配置
        ctx.set(remoteUploadConfig.key, upload.callback)

        ctx.update(uploadConfig.key, (prev) => {
          return {
            ...prev,
            uploader: remoteUploader(ctx),
            uploadWidgetFactory: (pos, spec) => {
              const widgetDOM = document.createElement('span')
              widgetDOM.classList.add(...upload.loading)

              return Decoration.widget(pos, widgetDOM, spec)
            },
          }
        })
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
