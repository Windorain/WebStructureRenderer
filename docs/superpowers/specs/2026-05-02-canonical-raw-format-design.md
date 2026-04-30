# Canonical Raw Format — 内存规范格式重构

## 问题

`ctx.scene` 持有混合格式（Compact / Raw），导致：
- `normalizeSceneDocumentForWiki` 被调用 10 次
- BlockInspector.saveTooltip 每次做 Compact→Raw→Compact 往返
- 每个编辑器需要检测格式类型
- syncPreview 全量 JSON 深拷贝

## 目标

- `ctx.scene` 永远存储 Raw 文档，成为单一规范内存格式
- Compact 仅在加载时解压一次（commitScene）、导出时压缩一次（download Compact）
- syncPreview 改为浅拷贝（共享大数组引用）

## 数据流

```
加载 Compact → commitScene() normalize → ctx.scene (Raw)
加载 Raw     → commitScene() 直接存储 → ctx.scene (Raw)
导出 Compact → buildCompactEnvelope() 仅在下载按钮调用
保存到文件   → JSON.stringify(ctx.scene) 直接序列化 Raw
syncPreview  → 浅拷贝 { ...doc } → loadPreviewSessionFromDocument
```

## 改动

### workbenchContext.ts
- `commitScene()`: Compact→normalize→Raw，不再 canonicalizeCompactInPlace
- `syncPreview()`: 浅拷贝代替深拷贝
- `writeSceneToLocalDisk()`, `saveWorkspaceFull()`: 直接序列化

### BlockInspector.vue
- 删除 Compact 检测+往返，直接读写 ctx.scene

### SceneInfoEditor.vue  
- mergeRootStringFields 删除 Compact 分支

### sceneExportKit.ts
- 删除 rebuildCompactPayloadInPlace / canonicalizeCompactInPlace
- 简化 mergeRootStringFields

### 导出组件
- 删除 normalizeSceneDocumentForWiki 调用（ctx.scene 已是 Raw）

## 保留
- normalizeSceneDocumentForWiki() — 仅 commitScene 使用
- buildCompactEnvelope() — 仅下载 Compact 使用
