/** 资源包定位符：namespace:path（不含 textures/ 与 .png），与 MC 习惯一致 */

export type ResourceLocator = string

export type MaterialKind = 'static16' | 'animated'

export interface MaterialEntry {
  locator: ResourceLocator
  kind: MaterialKind
}

export interface MaterialRegistryData {
  schemaVersion: number
  materials: Record<string, MaterialEntry>
}

export type FaceName = '+x' | '-x' | '+y' | '-y' | '+z' | '-z'

export type LayerRole = 'base' | 'cutout'

export interface FaceLayerDef {
  materialId: string
  tint?: string
  layerRole?: LayerRole
}

export interface FaceLayersDef {
  layers: FaceLayerDef[]
}

export interface BlockEntry {
  label?: string
  faces: {
    all?: FaceLayersDef
  } & Partial<Record<FaceName, FaceLayersDef>>
}

export interface BlockRegistryData {
  schemaVersion: number
  blocks: Record<string, BlockEntry>
}

/** data/models 下纯结构体，不含方块外观（由 BlockRegistry 提供） */
export interface SimpleModel {
  schemaVersion: number
  mode: 'simple'
  id: string
  source?: { javaClass?: string; structurePiece?: string; note?: string }
  axis?: {
    yLayers?: string
    rowsInLayer?: string
    charsInRow?: string
    spaceChar?: string
  }
  layers: string[][]
  symbolMap: Record<string, string>
}

/** Simple 渲染器使用的运行时定义：结构 + 已合并的方块外观 */
export interface SimpleDefinition {
  schemaVersion: number
  mode: 'simple'
  id: string
  layers: string[][]
  symbolMap: Record<string, string>
  blocks: Record<string, BlockEntry>
}

export interface VoxelGrid {
  sizeX: number
  sizeY: number
  sizeZ: number
  get(x: number, y: number, z: number): string
}
