import { Editor, rootCtx } from '@milkdown/core'
import { commonmark } from '@milkdown/preset-commonmark'

export { default as Coditor } from './components/Coditor.vue'

export function useGetEditor(plugins) {
  return root => Editor.make()
    .config(ctx => ctx.set(rootCtx, root))
    .config(ctx => plugins.map(item => item.config).filter(item => item).forEach(item => item(ctx)))
    .use(commonmark)
    .use(plugins.map(item => item.plugin).filter(item => item))
}
