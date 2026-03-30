import type { BlockEntry, FaceLayerDef, FaceName } from './types'

const ALL_FACES: FaceName[] = ['+x', '-x', '+y', '-y', '+z', '-z']

export function layersForFace(block: BlockEntry, face: FaceName): FaceLayerDef[] {
  const specific = block.faces[face]
  if (specific?.layers?.length) return specific.layers
  const all = block.faces.all?.layers
  if (all?.length) return all
  return []
}

export function listFaceNames(): FaceName[] {
  return ALL_FACES
}
