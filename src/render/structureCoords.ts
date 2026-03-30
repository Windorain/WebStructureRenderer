/**
 * StructureLib 与体素世界坐标的对齐（NORTH_DEFAULT / 与 GT addShape 字面量一致）。
 *
 * - `layers[c][b]` 中 **b** 为 slice 内「下一行」下标（与 StructureLib line b 一致）；
 *   GT5U 源码中**第一行字符串** = 结构顶部（最高世界 Y）。
 * - ExtendedFacing NORTH：`b` 轴为世界 FORGE.DOWN（+b_structure → 世界 −Y）。
 *   故：**世界体素 Y（底为 0 向上增）= sizeB - 1 - b**。
 */

/** 结构行下标 b（0=首行=顶）→ 包围盒内体素 Y 索引（0=底） */
export function structureRowToWorldY(row: number, sizeB: number): number {
  return sizeB - 1 - row
}
