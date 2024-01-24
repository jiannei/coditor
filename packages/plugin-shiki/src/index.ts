import { $ctx, $proseAsync } from '@milkdown/utils'
import { findChildren } from '@milkdown/prose'
import { Plugin, PluginKey } from '@milkdown/prose/state'
import type { Ctx, MilkdownPlugin } from '@milkdown/ctx'
import type { BundledLanguage, BundledTheme } from 'shikiji'
import { getHighlighter } from 'shikiji'
import { getDecorations } from './get-decorations'

export interface ShikiConfigOptions {
  themes: {
    light: BundledTheme
    dark: BundledTheme
  }
  langs: BundledLanguage[]
  dark: boolean
}

// shikiji/themes：BundledTheme
// shikiji/langs: BundledLanguage
export const shikiConfig = $ctx<ShikiConfigOptions, 'shikiConfig'>({
  themes: { light: 'github-light', dark: 'github-dark' },
  langs: ['bash', 'c', 'css', 'html', 'java', 'javascript', 'js', 'json', 'markdown', 'php', 'python', 'sql', 'sh'],
  dark: false,
}, 'shikiConfig')

export const shikiPlugin = $proseAsync(async (ctx: Ctx) => {
  const { langs, themes, dark } = ctx.get(shikiConfig.key)
  const theme: BundledTheme = (dark ? themes.dark : themes.light) as BundledTheme
  const name: string = 'code_block'

  const highlighter = await getHighlighter({
    langs,
    themes: Object.values(themes),
  })

  return new Plugin({
    key: new PluginKey('MILKDOWN_SHIKI'),
    state: {
      init: (_, { doc }) => getDecorations(doc, name, highlighter, theme),
      apply: (transaction, decorationSet, oldState, state) => {
        const isNodeName = state.selection.$head.parent.type.name === name
        const isPreviousNodeName = oldState.selection.$head.parent.type.name === name
        const oldNode = findChildren(node => node.type.name === name)(oldState.doc)
        const newNode = findChildren(node => node.type.name === name)(state.doc)
        const codeBlockChanged = transaction.docChanged
          && (isNodeName
          || isPreviousNodeName
          || oldNode.length !== newNode.length
          || oldNode[0]?.node.attrs.language !== newNode[0]?.node.attrs.language
          || transaction.steps.some((step) => {
            const s = step as unknown as { from: number, to: number }
            return (
              s.from !== undefined
              && s.to !== undefined
              && oldNode.some((node) => {
                return node.pos >= s.from && node.pos + node.node.nodeSize <= s.to
              })
            )
          }))

        if (codeBlockChanged)
          return getDecorations(transaction.doc, name, highlighter, theme)

        return decorationSet.map(transaction.mapping, transaction.doc)
      },
    },
    props: {
      decorations(state) {
        return this.getState(state)
      },
    },
  })
})

export const shiki: MilkdownPlugin[] = [shikiPlugin, shikiConfig]
