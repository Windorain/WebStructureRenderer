# 结构数据适配（占位）

本目录用于 **上游 DTO / 游戏模组形状** 与仓库内 **`StructureData`（voxelPalette）** 之间的转换脚本，与 Vue 应用构建解耦。

## 契约（目标形状）

- **`mode`**：`voxelPalette`
- **`cellGrid`**：数字立方体 `cellGrid[zSlice][row][column]`，值为 `palette` 下标（与 SDE / Wiki 渲染一致）
- **`axis`**（可选）：文档用，键名建议为 `zSlice` / `row` / `column` / `spaceChar`
- **`symbolMap`**、`initialCamera` 等见 `src/render/schema/types.ts`（终态仅 `blockPalette` + `materialPalette`）

体素索引与渲染一致：**`VoxelVolume.get(column, row, zSlice)`**，`row === 0` 为结构顶部（最高世界 Y）。

## 入口

- `adapter/index.ts`：可扩展 CLI 占位；实现时读取上游 JSON/Java 导出，写出 `data/scenes/<id>.json`（`voxelPalette`）。

应用本体不依赖此处；`npm run build` 不包含本目录。
