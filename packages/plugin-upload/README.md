<h1 align="center"> Milkdown remote upload plugin. </h1>

> Remote upload plugin for milkdown.

![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-blue?style=flat&labelColor=black)
![NPM Version](https://img.shields.io/npm/v/%40s2nc%2Fmilkdown-plugin-upload?style=flat)
![NPM License](https://img.shields.io/npm/l/%40s2nc%2Fmilkdown-plugin-upload?style=flat)

## 安装

```bash
npm i @s2nc/milkdown-plugin-upload
```

## 使用

```js
import { Milkdown, useEditor } from '@milkdown/vue'
import {rootCtx} from '@milkdown/core'
import { remoteUpload, remoteUploader } from '@s2nc/milkdown-plugin-upload'
import { uploadConfig } from '@milkdown/plugin-upload'

const { loading, get } = useEditor((root) => {
  return Editor.make()
    .config((ctx) => {
      // ...
      
      // 编辑器初始化配置
      ctx.set(rootCtx, root)

      // 配置图片远程上传
      ctx.update(uploadConfig.key, (prev) => {
        return {
          ...prev,
          uploader: remoteUploader(ctx),
          uploadWidgetFactory: (pos, spec) => {// loading 效果
            const widgetDOM = document.createElement('span')
            widgetDOM.classList.add(...['w-4', 'h-4', 'inline-block', 'i-tabler:loader', 'text-slate-500', 'dark:text-slate-400', 'animate-spin'])

            return Decoration.widget(pos, widgetDOM, spec)
          },
        }
      })

    })
    .use(remoteUpload)// 使用插件
})
```

## 示例

- [coditor](../../src/components/Coditor.vue)

## 协议

MIT 许可证（MIT）。有关更多信息，请参见[协议文件](LICENSE)。