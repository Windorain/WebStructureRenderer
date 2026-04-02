# 结构数据适配（占位）

本目录用于 **上游 DTO / 游戏模组形状** 与仓库内 **`StructureData`（schemaVersion 5）** 之间的转换脚本，与 Vue 应用构建解耦。

## 契约（目标形状）

- **`schemaVersion`**：`5`
- **`zSlices`**：`string[][][]` 语义为 `zSlices[zSlice][row][column]`（JSON 中内层为行字符串，字符即列）
- **`axis`**（可选）：文档用，键名建议为 `zSlice` / `row` / `column` / `spaceChar`
- **`symbolMap`**、`initialCamera`、`blocks`（经 `block_registry` 合并）等见 `src/render/types.ts`

体素索引与渲染一致：**`VoxelGrid.get(column, row, zSlice)`**，`row === 0` 为结构顶部（最高世界 Y）。

## 入口

- `adapter/index.ts`：可扩展 CLI 占位；实现时读取上游 JSON/Java 导出，写出 `data/scenes/<id>.json`（`voxelPalette`）。

应用本体不依赖此处；`npm run build` 不包含本目录。
