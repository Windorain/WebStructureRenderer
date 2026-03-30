/**
 * 解析方块在某个方向上的贴图层列表。
 *
 * 优先级：该方向的专用面（如 +x）→ faces.all → 无层则空数组。
 */

import type { BlockEntry, FaceLayerDef, FaceName } from './types'

const ALL_FACES: FaceName[] = ['+x', '-x', '+y', '-y', '+z', '-z']

export function layersForFace(block: BlockEntry, face: FaceName): FaceLayerDef[] {
  const specific = block.faces[face]
  if (specific?.layers?.length) return specific.layers
  const all = block.faces.all?.layers
  if (all?.length) return all
  return []
}

/** 遍历六个方向时使用的固定顺序（与法线、邻格偏移表一致） */
export function listFaceNames(): FaceName[] {
  return ALL_FACES
}
