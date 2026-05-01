# NEI 双主题系统设计

## 目标

将 Workbench 编辑器从无个性的 slate 暗色主题升级为 NEI/MC 风格，与 Embed 端视觉统一。建立 CSS 变量驱动的双主题系统（亮色 + 暗色），全局可控。

## 设计决策

- **亮色**：延续现有 NEI 亮色（`#c6c6c6` 灰底 + 绿 accent），Embed 默认使用，Wiki 嵌入兼容
- **暗色**：深蓝黑底 + 钻石蓝 accent（`#3b5f8a`），Workbench 默认
- **切换**：`<html data-nei-theme="light|dark">` 属性控制，读写 localStorage，持久化
- **Bevel 边框**：2px outset/inset 双色边框是 NEI 标志性视觉，两个主题都保留

## CSS Token 表

| Token | 亮色 | 暗色 | 用途 |
|---|---|---|---|
| `--nei-bg` | `#c6c6c6` | `#1a1e28` | 全局底色 |
| `--nei-bg-deep` | `#b0b0b0` | `#212636` | 面板/卡片底色 |
| `--nei-viewport-bg` | `#5a5a5a` | `#151920` | 视口背景 |
| `--nei-highlight` | `#ffffff` | `#3a4a5e` | bevel 亮边 |
| `--nei-shadow` | `#555555` | `#0d1119` | bevel 暗边 |
| `--nei-inset-bg` | `#373737` | `#12161e` | 输入框/凹陷区 |
| `--nei-inset-bg-mid` | `#2a2a2a` | `#1a2030` | 较深凹陷 |
| `--nei-text` | `#ffffff` | `#d0d8e8` | 主文字（深底） |
| `--nei-text-muted` | `#e8e8e8` | `#8898a8` | 辅助文字 |
| `--nei-text-dark` | `#303030` | `#d0d8e8` | 主文字（浅底） |
| `--nei-label-shadow` | `1px 1px 0 #3f3f3f` | `1px 1px 0 #0a0e14` | 标签投影 |
| `--nei-accent` | `#5a8c3e` | `#3b5f8a` | 主按钮/accent |
| `--nei-accent-hover` | `#4a7a2e` | `#4a72a0` | accent hover |
| `--nei-accent-text` | `#ffffff` | `#e0f0ff` | accent 上文字 |
| `--nei-accent-shadow` | `1px 1px 0 #2a5a1a` | `1px 1px 0 #0a1a2a` | accent 按钮投影 |
| `--nei-label` | `#555555` | `#6a7a8a` | label 色 |
| `--nei-muted` | `#707070` | `#5a6a7a` | 辅助/Muted |
| `--nei-border` | `#999999` | `#2a3040` | 一般边框 |
| `--nei-section-line` | `#999999` | `#2a3040` | 标题下划线 |
| `--nei-btn-bg` | `#8b8b8b` | `#242836` | 次要按钮 |
| `--nei-btn-text` | `#404040` | `#8898a8` | 次要按钮文字 |
| `--nei-focus-ring` | `#8080c0` | `#6080b0` | 焦点环 |

保留不变的 token：`--nei-bevel-w`、`--nei-status-ok`、`--nei-status-warn`、`--nei-status-err`、`--nei-tooltip-*`

## 文件变更

### 新增

- `src/workbench/composables/useNeiTheme.ts` — composable
  - `theme: Ref<'light'|'dark'>`
  - `toggleTheme()` — 切换并持久化
  - 初始化时读 `localStorage`，默认 dark

### 修改

- `src/styles/nei-tokens.css` — 扩展为双主题
- `src/workbench/WorkbenchRoot.vue` — 初始化 dark 主题 + 引入 useNeiTheme
- `src/workbench/components/MenuBar.vue` — 加主题切换按钮
- `src/workbench/components/SceneInfoEditor.vue` — 颜色值 → token
- `src/workbench/components/TooltipEditor.vue` — 颜色值 → token
- `src/workbench/components/BlockInspector.vue` — 颜色值 → token
- `src/workbench/components/BlockStatsEditor.vue` — 颜色值 → token
- `src/workbench/components/WikiConfigEditor.vue` — 颜色值 → token
- `src/workbench/components/PropertiesPanel.vue` — 颜色值 → token

### 不改

- `src/embed/` — Embed 端，NEI 亮色作为默认，行为不变
- `src/main.ts` — lib 入口，不设 dark
- `StructureViewport.vue` / 3D 渲染组件 — Three.js，不受 CSS 主题影响

## useNeiTheme 接口

```ts
// src/workbench/composables/useNeiTheme.ts
function useNeiTheme(): {
  theme: Ref<'light' | 'dark'>
  toggleTheme: () => void
}
```

- 读写 `document.documentElement.dataset.neiTheme`
- 持久化到 `localStorage('nei-theme')`
- 初始化：localStorage 有值用缓存，否则 `'dark'`

## 注意事项

- Embed 入口（`main.ts`）不调用 `useNeiTheme`，保持亮色默认
- Workbench 入口（`main-workbench.ts` → `WorkbenchRoot.vue`）在 `onMounted` 中初始化主题
- 主题切换按钮放在 MenuBar 右侧（View 菜单旁边或 StatusBar）
- `nei-tokens.css` 在 Embed 和 Workbench 都引入，不影响 Embed 行为（始终亮色）
