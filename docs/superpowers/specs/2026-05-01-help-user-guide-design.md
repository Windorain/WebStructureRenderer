# Help User Guide — Spec

## Goal

为工作台添加面向用户的帮助系统：编写中文使用指南 MD 文档，通过 markdown-it 渲染，在新增的「帮助」工作区标签页中展示。

## Architecture

```
docs/user-guide.md (新)         — 用户使用指南 Markdown
    ↓ Vite ?raw import
HelpWorkspace.vue (新)          — markdown-it 渲染 + 展示
    ↓ workspace === 'help'
WorkbenchRoot.vue (修改)        — 增加 help workspace 和 v-show 块
    ↓
WorkspaceTabs.vue (修改)        — 增加第 4 个标签 [帮助]
MenuBar.vue (修改)              — Help 菜单项激活，点击切换 workspace
i18n.ts (修改)                  — 增加 'help' 翻译键
```

## Components

### HelpWorkspace.vue

- 用 Vite `?raw` import 加载 `docs/user-guide.md` 为字符串
- 用 `markdown-it` 渲染为 HTML
- 通过 `v-html` 展示，带样式作用域

### WorkbenchRoot.vue

- `workspace` ref 类型扩展: `'preview' | 'wiki' | 'export' | 'help'`
- 新增 `v-show="workspace === 'help'"` 块，渲染 `HelpWorkspace`
- 共享 Menubar + Tabs 头部（与 wiki/export 的 standalone 布局一致）

### WorkspaceTabs.vue

- tabs 数组增加 `{ id: 'help' as const }`
- props 类型扩展

### MenuBar.vue

- Help 菜单项移除 `mb-disabled` 类
- 新增 `open-help` emit
- WorkbenchRoot 监听 `@open-help` 切换 workspace

## Dependencies

- `markdown-it` — Markdown 解析器
- `@types/markdown-it` — TypeScript 类型

## Document Content (user-guide.md)

涵盖：
1. 概述 — 工作台是什么
2. 加载场景 — 文件、SDE、内置示例
3. 编辑场景 — 元数据、Tooltip
4. 3D 视口操作 — 旋转/缩放/选取方块
5. 预览与导出 — Wiki 查看器、导出格式
6. SDE 连接 — 配置与同步

## Acceptance Criteria

- 点击菜单栏 Help → 切换到帮助标签页
- 帮助标签页显示格式化的 Markdown 内容（表格、代码块、标题层级）
- 帮助标签页可通过标签栏切换回其他工作区
- 类型检查 0 错误
- 构建通过
