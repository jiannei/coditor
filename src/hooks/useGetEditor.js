import { Editor, rootCtx } from '@milkdown/core'

export function useGetEditor(pluginConfigs) {
  return root => Editor.make()
    .config(ctx => ctx.set(rootCtx, root))
    .config(ctx => pluginConfigs.map(item => item.config).filter(item => item).forEach(item => item(ctx)))
    .use(pluginConfigs.map(item => item.plugin).filter(item => item))
}
