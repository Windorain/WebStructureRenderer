/**
 * Wiki 体素行下标与世界 Y 的映射（与 Forge / 渲染包围盒一致）。
 *
 * - `zSlices[zSlice][row]` 中 **row** 为截面内自上而下第几行；**row 0 = 结构顶部**（最高世界 Y）。
 * - 包围盒内体素 Y 索引（0=底）**= sizeRow - 1 - row**。
 */

/** 结构行下标 row（0=顶行）→ 包围盒内体素 Y 索引（0=底） */
export function structureRowToWorldY(row: number, sizeRow: number): number {
  return sizeRow - 1 - row
}
