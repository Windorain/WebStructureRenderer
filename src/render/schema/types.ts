/**
 * StructureData：`geometryPhase` 区分扫描中间态与可渲染终态；根级 `mode` 仅表示 Wiki 展示策略（与几何管线无关）。
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
  /** 溯源；打包态下 Wiki 仅使用 textureBlobIndex，不请求 locator */
  locator?: ResourceLocator
  kind: MaterialKind
  blend?: MaterialBlendMode
  emissive?: number
  animation?: MaterialAnimationSpec
}

/** 结构内材质调色盘条目（并入原独立 sampler 的 atlas / 线性 / mipmap 提示） */
export type MaterialPaletteEntry = MaterialEntry & {
  /** 指向根级 `textureBlobs` 池中的 PNG（Base64）；打包交付必填 */
  textureBlobIndex?: number
  /** MC 1.7：`blocks` / `items` 对应 `TextureMap.location*Texture`；`null`/缺省且为独立贴图时由导出写 `null` */
  atlas?: string | null
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

/** 磁盘 / 传输层文档形态；Wiki 据 `documentFormat` 选择解析路径。 */
export type DocumentFormat = 'Raw' | 'Compact'

/** 与 SDE 写出一致：单 gzip 流再以标准 Base64 嵌入 JSON 字符串。 */
export const COMPACT_PAYLOAD_ENCODING = 'gzip+base64' as const

/** Compact 信封根（解压合并后与 Raw 同形）。 */
export interface CompactSceneEnvelope {
  documentFormat: 'Compact'
  payloadEncoding: typeof COMPACT_PAYLOAD_ENCODING
  meta: Record<string, unknown>
  payload: string
}

/**
 * 渲染包：仅 `document` 为可信源（StructureData 或 World）；纹理须已内嵌于 `document.textureBlobs`。
 */
export interface RenderBundle {
  /** 与 BakedQuads 终态契约对齐时可 bump */
  payloadSchemaVersion?: number
  document: unknown
  bundleId?: string
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

/** Wiki 展示：多方块启用统计侧栏与分层条；简单模式关闭二者 */
export type SceneDisplayMode = 'multiblock' | 'simple'

/** 数据形态：scan=服务端扫描待客户端烘焙；baked=含 BakedQuads 可渲染 */
export type StructureGeometryPhase = 'scan' | 'baked'

/** 扫描中间态（SDE 写出；Wiki 不直接渲染） */
export interface StructureDataScan {
  geometryPhase: 'scan'
  mode: SceneDisplayMode
  id: string
  label?: string
  gtnhVersion?: string
  author?: string
  description?: string | null
  /** 模组来源（如多方块 mod），可选 */
  modSource?: string
  globalConfig?: Record<string, unknown>
  source?: { javaClass?: string; structurePiece?: string; note?: string }
  axis?: {
    zSlice?: string
    row?: string
    column?: string
    spaceChar?: string
  }
  scanBounds?: { minX: number; maxY: number; minZ: number }
  initialCamera?: InitialCameraDef
  cellTypes: unknown[]
  cellGrid: number[][][]
  worldGrid: unknown
}

/** 可渲染终态（palette + cellGrid） */
export interface StructureDataBaked {
  geometryPhase: 'baked'
  mode: SceneDisplayMode
  id: string
  label?: string
  gtnhVersion?: string
  author?: string
  description?: string | null
  modSource?: string
  schemaVersion?: number
  globalConfig?: Record<string, unknown>
  textureBlobs?: string[]
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

export type StructureData = StructureDataScan | StructureDataBaked

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

/** Wiki 网格管线使用的终态结构（保证已烘焙） */
export type StructureDefinition = StructureDataBaked

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
  mode?: SceneDisplayMode
  label?: string
  gtnhVersion?: string
  author?: string
  description?: string | null
  modSource?: string
  globalConfig?: Record<string, unknown>
  /** 各帧内嵌 structure 的 materialPalette 共用此池 */
  textureBlobs?: string[]
  frames: Frame[]
  playback?: { loop?: boolean; defaultFrameIndex?: number }
}
