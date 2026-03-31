/**
 * 占位入口：将上游形状 DTO 转为 schemaVersion 5 的 StructureData 时在此实现 CLI。
 * 当前不执行任何 I/O。本文件未纳入 `vue-tsc` 的 include，修改后若需类型检查可单独 `tsc` 或加入 tsconfig。
 */
export function main(): void {
  console.info(
    '[adapter] 占位：实现时解析参数、读入上游数据、写出 data/structures/*.simple.json（schemaVersion 5, zSlices）。',
  )
}
