import type { Node } from '@milkdown/prose/model'
import type { BundledTheme, Highlighter } from 'shikiji'
import { Decoration, DecorationSet } from '@milkdown/prose/view'
import { findChildren } from '@milkdown/prose'

export interface FlattedNode {
  content: string
  color: string
}

export function getDecorations(doc: Node, name: string, highlighter: Highlighter, theme: BundledTheme) {
  const decorations: Decoration[] = []

  const children = findChildren(node => node.type.name === name)(doc)

  children.forEach(async (block) => {
    let from = block.pos + 1
    const { language } = block.node.attrs

    if (!language || !highlighter.getLoadedLanguages().includes(language)) {
      console.warn('Unsupported language detected, this language has not been supported by current shiki config: ', language)
      return
    }

    const nodes = highlighter.codeToThemedTokens(block.node.textContent, {
      lang: language,
      theme,
    }).map(token =>
      token.map(
        ({ content, color }) =>
          ({
            content,
            color,
          } as FlattedNode),
      ),
    )

    nodes.forEach((block) => {
      block.forEach((node) => {
        const to = from + node.content.length
        const decoration = Decoration.inline(from, to, {
          style: `color: ${node.color}`,
        })
        decorations.push(decoration)
        from = to
      })
      from += 1
    })
  })

  return DecorationSet.create(doc, decorations)
}
