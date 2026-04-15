/**
 * voxelPalette：终态 StructureData =全局字段 + blockPalette + materialPalette + cellGrid。
 * 几何仅来自 blockPalette[].geometry（BakedQuads）；材质仅 materialPalette[materialIndex]。
 */

/** 资源包定位符：namespace:path（不含 textures/ 与 .png），与 MC 习惯一致 */
export type ResourceLocator = string

export type MaterialKind = 'static16' | 'animated'

export type MaterialBlendMode = 'opaque' | 'cutout' | 'translucent'

/** 字段形状对齐 Java 版纹理 `.mcmeta` 的 `animation`；数据来自 JSON 非独立 mcmeta 文件。`kind === 'animated'` 且 PNG 为竖条多帧时按顺序 1 tick/帧播放（见 simpleMaterialLibrary） */
export interface MaterialAnimationSpec {
  defaultFrametimeTicks?: number
  frameSequence?: Array<{ index: number; timeTicks?: number }>
  interpolate?: boolean
}

export interface MaterialEntry {
  locator: ResourceLocator
  kind: MaterialKind
  blend?: MaterialBlendMode
  emissive?: number
  animation?: MaterialAnimationSpec
}

/** 结构内材质调色盘条目（并入原独立 sampler 的 atlas / 线性 / mipmap 提示） */
export type MaterialPaletteEntry = MaterialEntry & {
  atlas?: string
  linear?: boolean
  useMipmaps?: boolean
}

/** materialId → 条目；键由 StructureData.materialPalette 或 World 多帧 `frameIndex:localIndex` 派生 */
export interface MaterialRegistryData {
  schemaVersion?: number
  materials: Record<string, MaterialEntry>
}

/** @deprecated 旧 capture 管线；不再写入 StructureData */
export interface MeshCaptureVertex {
  x: number
  y: number
  z: number
  u: number
  v: number
  brightness?: number
  color?: number
}

/** @deprecated */
export interface MeshCaptureQuad {
  materialKey: string
  samplerIndex: number
  vertices: MeshCaptureVertex[]
}

/** @deprecated */
export interface MeshCaptureInstance {
  x: number
  y: number
  z: number
  label?: string
  quads: MeshCaptureQuad[]
}

/** @deprecated */
export interface MeshCaptureSampler {
  texture: string
  atlas?: string
  linear?: boolean
  useMipmaps?: boolean
}

/** @deprecated */
export interface MeshCapturePayload {
  schemaVersion?: number
  uvSpace?: 'spriteLocal'
  samplers: MeshCaptureSampler[]
  instances: MeshCaptureInstance[]
}

/**
 * 渲染包：仅 `document` 为可信源（StructureData 或 World）；纹理由客户端按各帧 materialPalette 预取。
 */
export interface RenderBundle {
  /** 与 BakedQuads 终态契约对齐时可 bump */
  payloadSchemaVersion?: number
  document: unknown
  bundleId?: string
  assetsBaseUrl?: string
}

export type FaceName = '+x' | '-x' | '+y' | '-y' | '+z' | '-z'

export interface MaterialResolveNeighborShell {
  type: 'neighborShell'
  casingToMaterialId: Record<string, string>
  fallbackMaterialId?: string
}

export interface MaterialResolveNeighborShellBlock {
  type: 'neighborShellBlock'
  fallbackMaterialId?: string
}

export type MaterialResolveRule = MaterialResolveNeighborShell | MaterialResolveNeighborShellBlock

export interface FaceLayerDef {
  materialId: string
  tint?: string
  blend?: MaterialBlendMode
  materialResolve?: MaterialResolveRule
}

export interface FaceLayersDef {
  layers: FaceLayerDef[]
}

export type BlockMeshKind = 'SimpleCube' | 'Model' | 'Unknown'

/** @deprecated 仅遗留 block_registry */
export interface BlockEntry {
  label?: string
  description?: string
  meshKind: BlockMeshKind
  modelId?: string
  renderProfile?: string
  occludesAdjacentFaces?: boolean
  faces?: {
    all?: FaceLayersDef
  } & Partial<Record<FaceName, FaceLayersDef>>
}

export type ModelFaceName = 'north' | 'south' | 'east' | 'west' | 'up' | 'down'

export interface ModelFaceLayerDef {
  texture: string
  blend?: MaterialBlendMode
  tint?: string
}

export interface ModelElementFaceDef {
  texture?: string
  layers?: ModelFaceLayerDef[]
  uv?: [number, number, number, number]
}

export interface ModelElement {
  from: number[]
  to: number[]
  faces?: Partial<Record<ModelFaceName, ModelElementFaceDef>>
}

export interface ModelDocument {
  elements: ModelElement[]
}

export interface ModelRegistryData {
  schemaVersion?: number
  models: Record<string, ModelDocument>
}

export interface BlockRegistryData {
  schemaVersion?: number
  blocks: Record<string, BlockEntry>
}

export interface InitialCameraDef {
  focusBlockId: string
  frontFace: FaceName
  distance?: number
}

export type JsonNbt = Record<string, unknown>

/** 体素逻辑态（运行时由 blockPalette 条目映射） */
export interface VoxelState {
  registryId: string
  meta: number
  facing?: FaceName
  nbt?: JsonNbt
}

export const AIR_VOXEL: VoxelState = { registryId: 'air', meta: 0 }

export function isAirState(v: VoxelState): boolean {
  return v.registryId === 'air'
}

export type BlockRenderMode = 'BakedQuads' | 'Special'

export type BakedGeometryEncoding = 'bakedQuadsJsonV1' | 'packedQuadsV1'

export interface BakedQuadVertex {
  x: number
  y: number
  z: number
  u: number
  v: number
  brightness?: number
  color?: number
}

/** geometry.quads 有序：绘制顺序与数组顺序一致 */
export interface BakedQuad {
  materialIndex: number
  vertices: BakedQuadVertex[]
}

export interface BakedQuadsGeometry {
  encoding: BakedGeometryEncoding
  quads: BakedQuad[]
}

/** 方块调色盘条目：逻辑 +烘焙几何 */
export interface BlockPaletteEntry {
  registryId: string
  meta: number
  facing?: FaceName
  nbt?: JsonNbt
  /** 完整不透明立方体时邻面可剔除；缺省/非 true 视为不遮挡（旧 JSON 兼容） */
  occludesAdjacentFaces?: boolean
  renderMode: BlockRenderMode
  geometry: BakedQuadsGeometry
}

/** Wiki 仅接受此版本及以上的终态 StructureData（含 blockPalette 烘焙几何 + materialPalette） */
export const STRUCTURE_DATA_SCHEMA_FINAL = 8

/**
 * 磁盘 / 运行时结构根（schemaVersion 8 = BakedQuads 终态）。
 * cellGrid[z][row][col] 为 blockPalette 下标。
 */
export interface StructureData {
  /** 须为 {@link STRUCTURE_DATA_SCHEMA_FINAL}；更小版本为 SDE 未完成扫描，Wiki 拒绝 */
  schemaVersion?: number
  mode: 'voxelPalette'
  id: string
  source?: { javaClass?: string; structurePiece?: string; note?: string }
  axis?: {
    zSlice?: string
    row?: string
    column?: string
    spaceChar?: string
  }
  blockPalette: BlockPaletteEntry[]
  materialPalette: MaterialPaletteEntry[]
  cellGrid: number[][][]
  scanBounds?: { minX: number; maxY: number; minZ: number }
  initialCamera?: InitialCameraDef
}

/** 与 StructureData 同形（合并层已恒等） */
export type StructureDefinition = StructureData

export function voxelStateFromBlockPaletteEntry(e: BlockPaletteEntry): VoxelState {
  return {
    registryId: e.registryId,
    meta: e.meta,
    facing: e.facing,
    nbt: e.nbt,
  }
}

export interface VoxelVolume {
  sizeColumn: number
  sizeRow: number
  sizeZSlice: number
  get(column: number, row: number, zSlice: number): VoxelState
}

export interface Frame {
  index?: number
  structure?: StructureData
  structureRef?: string
  durationMs?: number
  label?: string
}

export interface World {
  schemaVersion?: number
  id: string
  frames: Frame[]
  playback?: { loop?: boolean; defaultFrameIndex?: number }
}
