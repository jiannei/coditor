<h1 align="center"> Milkdown shiki plugin. </h1>

> Shiki plugin for milkdown.

![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-blue?style=flat&labelColor=black)
![NPM Version](https://img.shields.io/npm/v/%40s2nc%2Fmilkdown-plugin-shiki?style=flat)
![NPM License](https://img.shields.io/npm/l/%40s2nc%2Fmilkdown-plugin-shiki?style=flat)

## 安装

```bash
npm i @s2nc/milkdown-plugin-shiki
```

## 使用

```js
import { shiki, shikiConfig } from '@s2nc/milkdown-plugin-shiki'
import { Milkdown, useEditor } from '@milkdown/vue'
import {rootCtx} from '@milkdown/core'

const { loading, get } = useEditor((root) => {
  return Editor.make()
    .config((ctx) => {
      // ...
      
      // 编辑器初始化配置
      ctx.set(rootCtx, root)

      // 代码高亮设置
      ctx.set(shikiConfig.key, {
        themes: { light: 'dracula', dark: 'dracula-soft' },
        langs: ['bash', 'c', 'css', 'go', 'html', 'java', 'javascript', 'js', 'json', 'markdown', 'php', 'python', 'sql', 'sh', 'rust', 'vue'],
        dark: false,
      })

    })
    .use(shiki)// 使用插件
})
```

## 示例

- [coditor](../../src/components/Coditor.vue)

## 协议

MIT 许可证（MIT）。有关更多信息，请参见[协议文件](LICENSE)。