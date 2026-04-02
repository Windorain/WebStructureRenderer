/**
 * 解析方块在某个方向上的贴图层列表。
 *
 * 语义：`faces.all` 的层 + 该方向 `faces[face]` 的层（先 all 后专属，用于基底 + 单面叠加）。
 * 若未配置 `all`，则仅使用面专属层（与「只有某面有贴图」兼容）。
 */

import type { BlockEntry, FaceLayerDef, FaceName } from './types'

const ALL_FACES: FaceName[] = ['+x', '-x', '+y', '-y', '+z', '-z']

export function layersForFace(block: BlockEntry, face: FaceName): FaceLayerDef[] {
  const faces = block.faces ?? {}
  const all = faces.all?.layers ?? []
  const specific = faces[face]?.layers ?? []
  return [...all, ...specific]
}

/** 遍历六个方向时使用的固定顺序（与法线、邻格偏移表一致） */
export function listFaceNames(): FaceName[] {
  return ALL_FACES
}
