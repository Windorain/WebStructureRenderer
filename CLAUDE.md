# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | Vite 开发服务器 |
| `npm run build` | 类型检查 + 完整构建（lib + workbench） |
| `npm run build:lib` | 仅嵌入库 (`dist/`) |
| `npm run build:workbench` | 仅工作台 (`dist-workbench/`) |
| `npx vue-tsc --noEmit` | 仅类型检查，不构建 |

## 架构

### 两种产物

- **嵌入库** (`main.ts` → `dist/`) — `EmbedViewer.vue` + `mount()` 函数，供 Wiki 页面嵌入。纯查看，无编辑功能。
- **工作台** (`main-workbench.ts` → `dist-workbench/`) — `WorkbenchRoot.vue`，Blender 风格编辑器。与 SDE (StructureDataExporter) 配套使用。

### 状态管理（2 个 Context + 2 个模块级单例）

```
WorkbenchRoot.vue
├─ provideSceneContext()       → SceneContext (自包含，场景+预览+文件I/O)
├─ provideConnectionContext(scene) → ConnectionContext (显式依赖 SceneContext)
├─ useStatusMessage()          → 全局 statusMessage ref (模块级)
├─ useNeiTheme()               → 全局 theme ref (模块级)
│
├─ SceneContext 消费者: SceneInfoEditor, TooltipEditor, BlockInspector,
│   BlockStatsEditor, WorkbenchViewport, ViewportHost, WikiViewerWorkspace,
│   WorkbenchPreviewPanel, LocalFilePanel, LocalBundlePanel, StatusBar
│
├─ ConnectionContext 消费者: SdeConnectionPanel, ExportsListPanel
│
├─ Scene+Connection 消费者: ExportWorkspace, MenuBar, WorkbenchSettingsDrawer
│
└─ wikiConfig.ts (模块级 reactive, 仅 WikiViewerWorkspace + WikiConfigEditor 消费)
```

### 工作台组件树

```
WorkbenchRoot.vue
├─ MenuBar.vue        — File/Edit/View/Help 菜单
├─ WorkspaceTabs.vue  — [编辑] [Wiki 查看器] [导出] 标签
├─ WorkbenchShell     — CSS Grid 两列布局
│  ├─ ViewportHost    — WorkbenchViewport 包装器
│  │  └─ WorkbenchViewport  — 3D 编辑器视口 + 悬浮 ToolShelf + 播放器 + 分层条
│  └─ PropertiesPanel — 右侧属性面板 (KeepAlive + component :is)
│     ├─ SceneInfoEditor
│     ├─ BlockInspector
│     └─ BlockStatsEditor
├─ WikiViewerWorkspace — EmbedViewer + WikiConfigEditor + 尺寸校准
└─ ExportWorkspace     — 全页导出界面
```

### 数据流（关键）

```
加载: 文件 → scene.loadSceneFromFile() → scene (Raw)
      SDE  → conn.loadExport() / conn.pullFromServer() → scene.loadSceneDocument() → scene (Raw)
      内置 → scene.loadBuiltinScene() → scene (Raw)
                                    ↓
                           scene.syncPreview() → previewConfig → previewEpoch++
                                    ↓
              EmbedViewer (:key=previewEpoch) / WorkbenchViewport (:key=previewEpoch)

编辑: 表单变更 → 原地修改 scene.scene.value → scene.markDirty() → scene.syncPreview() → previewConfig 更新
       ↑ (不建新对象引用，避免 watch 回环)

保存: scene.scene.value (Raw) → JSON.stringify → scene.saveToFile() / conn.pushToServer()
Compact: 仅 buildCompactEnvelope() 导出时使用
```

**核心原则：**
- `scene.scene` 是唯一真源，始终为 Raw 格式。Compact 仅在加载时解压一次，导出时压缩一次。
- 编辑器**原地修改** `scene.scene.value`，不替换对象引用（`Ref<>.value = newObj` 会触发 watch 回环）。
- 预览通过 `:key="previewEpoch"` 强制重挂载来刷新，不能依赖 prop 变化（因为 store 在 setup 中创建一次）。
- 工作空间切换用 `v-show`，不能用 `v-if`（会销毁 WebGL context，store 的 materialLibrary 被 dispose 后无法复用）。
- ConnectionContext **显式依赖** SceneContext（构造时注入），依赖方向: `ConnectionContext → SceneContext`，单向无循环。

## 经验教训

1. **Vue `v-model` 不能绑定 `v-for` 内的嵌套 Ref** — `v-for="f in [{v: myRef}]"` 中 `v-model="f.v"` 无法正确读写 Ref。Vue 只在模板顶层自动解包 Ref。必须写 `v-model="myRef"`。

2. **`ctx.scene.value = newObj` 触发 watch 回环** — 用 `mergeRootStringFields` 每次建新对象赋值给 Ref，会触发 `watch(() => ctx.scene.value, ...)` → 重置表单 → 触发字段 watch → 再次修改 → 无限循环。正确做法：直接修改原对象属性 `doc.mode = 'x'`。

3. **`:key` 值必须是顶层 Ref 或使用 `.value`** — 模板里 `:key="ctx.previewEpoch.value"` 需要在模板编译后仍能被 Vue 追踪。如果 `ctx` 是普通对象（非 reactive），`.value` 访问才能建立依赖。

4. **`v-if` 切换工作空间会销毁 WebGL** — `v-if` 卸载组件时 `onBeforeUnmount` 中 `store.disposeCachesAndLibrary()` 释放 materialLibrary。重新挂载时 store 发现 library 已 dispose 静默放弃渲染。用 `v-show` 保持 DOM 和 context 存活。

5. **调试先加日志，不要猜测修复** — 本次修改 `@change` → debounce → watch → 直接修改，反复尝试了 4 次才定位到 `v-for` + `v-model` 是根因。如果一开始就在关键节点加 `console.log` 追踪数据流，可以更快定位。

6. **闭包捕获可变的 config 导致静默失效** — `createPreviewSceneStore(config)` 将 config 捕获为闭包常量。工作台 `syncPreview` 每次生成新 PreviewConfig，但 store 内部仍读旧对象，`setCurrentWorldFrame` / `presentContentMesh` 操作在过期数据上静默返回。修复：config 改为 `ShallowRef`，WorkbenchViewport watch prop 变化时同步。教训：
   - **跨作用域传递可变数据，用 `Ref`/`ReadonlyRef` 而非裸值**。类型系统应该在接口层面就表达"这个值会变"，不给调用方留下"要不要跟随更新"的歧义。
   - **状态流必须单一方向、单一真源**。`ctx.previewConfig` 是源头，store 不应该内部快照一份，而是持有对源头的引用或暴露更新接口。
   - **API 要简洁明确**：一个函数如果捕获外部状态，要么声明为只读快照（语义清晰），要么接收 Ref 并跟随更新。中间态（裸值 + 隐式假设不变）是 bug 温床。
   - **静默 return 是排查的黑洞**。`presentContentMesh` 有多处 `if (!x) return` 无日志输出，问题潜伏数月。关键路径的防御性返回必须打 warn，否则线上无感知、排查全靠猜。

## 设计原则

### API 设计

1. **状态对外只读** — 所有 context 中的 Ref/ShallowRef 通过 `readonly` 接口修饰符暴露。写入只能通过显式 setter/方法，确保所有修改点可审计（grep 方法名即可定位）。

2. **简单性优先于一致性** — 不应为了一致性而过度抽象。`wikiConfig`（仅 2 文件消费）和 `useNeiTheme`（全局 CSS 主题）保持模块级单例，不纳入 context。判断标准：语义上属于工作台状态的进 context，属于全局 UI 的保持模块级。

3. **命名统一** — 方法命名遵循统一模式：setter 用 `setXxx`，副作用操作用动词开头（`load`/`save`/`sync`/`push`/`pull`），部分更新用 `updateXxx`。删除的方法：`saveWorkspaceMetadataPatch`、`applyMetadataPatch`、`setMainSection`（零消费者）。

4. **文件名即接口** — 每个 context 文件导出 `provideXxxContext()` 和 `useXxxContext()`，接口名即文件名（`SceneContext` ↔ `sceneContext.ts`）。

### 纯函数 vs 副作用

5. **从函数签名区分纯函数与副作用**：
   - 纯函数：参数为普通值/对象（非 Ref），返回具体类型。不修改入参，不读写全局状态。
   - 副作用函数：参数含 `Ref`/`ShallowRef` 或返回 `Promise<void>`。JSDoc 用 `@side-effect` 标注副作用类型。
   - 纯函数移入 `utils/` 或领域目录（如 `render/data/sceneExport.ts`），不放在 context 文件中。

6. **单一真源、单向数据流** — `scene.scene.value` 是唯一真相源。`previewConfig` 是派生状态。数据流方向固定：`scene → syncPreview() → previewConfig → previewEpoch++ → 视口重渲染`。不允许多条路径修改同一状态。

### 目录分层

7. **库入口不引用 workbench** — `src/main.ts`（嵌入库）不导入任何 `src/workbench/` 下的文件。共享代码放在 `src/render/`、`src/preview/`、`src/util/`。

8. **死代码立即删除** — 零消费者的方法/组件/文件直接删除，不留注释、不标记 deprecated。`ExportQuickActions.vue` 是典型例子（功能与 `ExportWorkspace.vue` 重复且未被任何文件 import）。

### 上下文边界

9. **Context 自包含** — SceneContext 不依赖任何其他 context，可独立测试。ConnectionContext 显式依赖 SceneContext（构造时 `provideConnectionContext(scene)`），依赖方向单向无循环。

10. **禁止回调包装器** — 不使用 `commitEdits(callback)` 模式隐藏突变。编辑器直接修改 `scene.scene.value` + 调用 `syncPreview()`，数据流可见、可追踪。闭包捕获的回调隐藏了「谁改了啥」。
