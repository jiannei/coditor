# coditor

> 一个基于 milkdown 类似 typora 风格的编辑器，渐进式插件扩展，支持自定义任何样式，在此基础上可以构建完全属于你的编辑器。

- [milkdown](https://milkdown.dev/)
- [线上地址](https://jiannei.github.io/coditor/)

项目目前使用最新版本 `milkdown 7.3.3`，基于`vue 3.4.15`、`vite 5.0.12`、`unocss 0.58.4`构建，除了 milkdown 提供的[官方插件](https://milkdown.dev/docs/plugin/using-plugins#official-plugins)外，还额外扩展了 3 个插件：

- [plugin-placeholder](./packages/plugin-placeholder/README.md)：初始内容提示
- [plugin-shiki](./packages/plugin-shiki/README.md)：[shiki](https://github.com/shikijs/shiki) 代码语法高亮
- [plugin-upload](./packages/plugin-upload/README.md)：远程图片上传

## 本地开发

```shell
# 克隆项目
git clone https://github.com/jiannei/coditor.git

# 进入项目目录
cd coditor

# 安装依赖
npm install

# 启动服务
npm run dev
```

浏览器访问：http://localhost:5174/

## 目录结构

```log
.
├── README.md
├── bun.lockb
├── eslint.config.js
├── examples                            // 使用示例
│   ├── App.vue
│   ├── main.ts
│   └── vite-env.d.ts
├── index.html
├── package.json
├── packages                            // milkdown 扩展插件
│   ├── plugin-placeholder              // 初始内容提示
│   ├── plugin-shiki                    // 代码语法高亮
│   └── plugin-upload                   // 远程图片上传
├── src
│   ├── assets                          // 静态资源文件
│   │   └── css                         // 主题样式
│   ├── components                      // milkdown 编辑器封装
│   │   ├── Coditor.vue
│   │   ├── CoditorContainer.vue
│   │   ├── CoditorToobarItem.vue
│   │   ├── CoditorToorbar.vue
│   │   └── MilkdownEditor.vue
│   ├── hooks                           // composition 风格函数
│   │   └── usePoem.js
│   └── index.js
├── tsconfig.json
├── tsconfig.node.json
├── uno.config.ts                       // unocss 配置
└── vite.config.ts                      // vite 构建配置
```

## 协议

MIT 许可证（MIT）。有关更多信息，请参见[协议文件](LICENSE)。