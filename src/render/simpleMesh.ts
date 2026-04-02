/**
 * voxelPalette 模式体素网格（薄导出）：实现见 `blockMesh` / `quadGeometry`。
 */

export { quadGeometryForFace } from './quadGeometry'
export { buildBlockMesh, type BuildBlockMeshOptions, type BlockMeshResult } from './blockMesh'

import { buildBlockMesh, type BlockMeshResult } from './blockMesh'

/** @deprecated 使用 `buildBlockMesh`；保留别名以兼容旧导入 */
export type SimpleMeshResult = BlockMeshResult

/** @deprecated 使用 `buildBlockMesh` */
export async function buildSimpleMesh(
  ...args: Parameters<typeof buildBlockMesh>
): Promise<BlockMeshResult> {
  return buildBlockMesh(...args)
}
