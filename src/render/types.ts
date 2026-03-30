/** Simple 模式：结构 + 方块外观（与计划中的 SimpleDefinition 对齐） */

export type FaceName = '+x' | '-x' | '+y' | '-y' | '+z' | '-z'

export interface FaceLayerDef {
  texture: string
  tint?: string
}

export interface FaceLayersDef {
  layers: FaceLayerDef[]
}

export interface BlockAppearanceDef {
  label?: string
  faces: {
    all?: FaceLayersDef
  } & Partial<Record<FaceName, FaceLayersDef>>
}

export interface SimpleDefinition {
  schemaVersion: number
  mode: 'simple'
  id: string
  layers: string[][]
  symbolMap: Record<string, string>
  blocks: Record<string, BlockAppearanceDef>
}

export interface VoxelGrid {
  sizeX: number
  sizeY: number
  sizeZ: number
  /** blockId 或 'air' */
  get(x: number, y: number, z: number): string
}
