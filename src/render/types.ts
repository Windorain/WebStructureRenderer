/**
 * Simple / voxelPalette 模式下的类型定义。
 *
 * **结构 JSON schemaVersion**：`6` 起形状为 `palette` + `cellGrid`（Wiki 体素轴不变）。
 *
 * 数据流概览：
 *   磁盘 JSON（StructureData）→ mergeStructureData + block_registry → StructureDefinition
 *   StructureDefinition → VoxelVolume（get(column,row,zSlice) → VoxelState）
 *   assets/resolveAssets：locator → PNG URL / mcmeta 原文
 *   SimpleMaterialLibrary：注册表 + 纹理 / mcmeta → MeshStandardMaterial
 *   simpleMesh：体素 → BatchDescriptor；**WebGLRenderer** 在 viewport 中绘制
 */

/** 资源包定位符：namespace:path（不含 textures/ 与 .png），与 MC 习惯一致 */
export type ResourceLocator = string

export type MaterialKind = 'static16' | 'animated'

/**
 * kind 为提示；运行时是否播放动画以「存在 `.png.mcmeta` 且含 `animation`、且 PNG 为竖直多帧条」为准。
 */
export interface MaterialEntry {
  locator: ResourceLocator
  kind: MaterialKind
}

/** material_registry.json 根结构 */
export interface MaterialRegistryData {
  schemaVersion: number
  materials: Record<string, MaterialEntry>
}

export type FaceName = '+x' | '-x' | '+y' | '-y' | '+z' | '-z'

/** 多层贴花时：底层不透明，上层可透明镂空 */
export type LayerRole = 'base' | 'cutout'

export interface FaceLayerDef {
  materialId: string
  tint?: string
  layerRole?: LayerRole
}

export interface FaceLayersDef {
  layers: FaceLayerDef[]
}

/**
 * 方块几何构建策略（非 Three.js WebGLRenderer）；缺省为 SimpleCube。
 */
export type BlockMeshKind = 'SimpleCube'

/** 方块在六个方向上的贴图层；可只写 all 表示六面相同。面专属层与 `all` 合并，见 `layersForFace`。 */
export interface BlockEntry {
  label?: string
  /** 长说明；与 `label` 可同时存在，tooltip 中分行展示 */
  description?: string
  /** 缺省为 `SimpleCube` */
  meshKind?: BlockMeshKind
  faces: {
    all?: FaceLayersDef
  } & Partial<Record<FaceName, FaceLayersDef>>
}

/** block_registry.json 根结构 */
export interface BlockRegistryData {
  schemaVersion: number
  blocks: Record<string, BlockEntry>
}

/**
 * 初始相机（可选块）：若存在则必须写全；用于轨道中心与「机器正面」朝外法线。
 * - `focusBlockId`：与 palette 中某体素的 `registryId` 一致，网格中第一个匹配体素为焦点。
 * - `frontFace`：机器正面朝外的世界法线（默认朝北为 **-z**）。
 */
export interface InitialCameraDef {
  focusBlockId: string
  frontFace: FaceName
  /** 相机沿正面法线到焦点体素中心的距离；省略时由运行时默认 */
  distance?: number
}

/** JSON 可序列化的 NBT 子集（嵌套对象/数组 + 叶子原语） */
export type JsonNbt = Record<string, unknown>

/**
 * 单个体素逻辑状态（GTNH 1.7.10：registryId + meta + 可选 TE NBT）。
 */
export interface VoxelState {
  registryId: string
  meta: number
  nbt?: JsonNbt
}

/** 与磁盘 palette 中空气条目一致 */
export const AIR_VOXEL: VoxelState = { registryId: 'air', meta: 0 }

/** 与磁盘/合并后 `palette` 中空气条目一致时使用 */
export function isAirState(v: VoxelState): boolean {
  return v.registryId === 'air'
}

/**
 * 磁盘结构数据（schemaVersion 6）：调色板 + 三维整数网格（palette 下标）。
 * `cellGrid[zSlice][row][column]`，轴约定与旧版 zSlices 相同。
 */
export interface StructureData {
  schemaVersion: 6
  mode: 'voxelPalette'
  id: string
  source?: { javaClass?: string; structurePiece?: string; note?: string }
  axis?: {
    zSlice?: string
    row?: string
    column?: string
    spaceChar?: string
  }
  /** 去重后的体素状态；须含空气项（registryId `air`） */
  palette: VoxelState[]
  /**
   * 与 zSlices 同形：外层 Z 切片 → 行（顶行先）→ 列（世界 X）。
   * 值为 `palette` 下标。
   */
  cellGrid: number[][][]
  initialCamera?: InitialCameraDef
}

/**
 * 合并 block_registry 后的运行时定义。
 */
export interface StructureDefinition {
  schemaVersion: 6
  mode: 'voxelPalette'
  id: string
  palette: VoxelState[]
  cellGrid: number[][][]
  blocks: Record<string, BlockEntry>
  initialCamera?: InitialCameraDef
}

/**
 * 体素查询：索引 (column, row, zSlice) 与 `cellGrid[zSlice][row][column]` 一致；
 * **row 0 = 顶行**（最高 Y）。`get` 返回 `VoxelState`；空气为 `registryId === 'air'`。
 */
export interface VoxelVolume {
  sizeColumn: number
  sizeRow: number
  sizeZSlice: number
  get(column: number, row: number, zSlice: number): VoxelState
}

/** 多帧容器（可选；单帧场景可仅用 StructureData） */
export interface WorldFrame {
  /** 内嵌单帧结构；与 structureRef 二选一 */
  structure?: StructureData
  /** 相对 data/structures 的路径或 id，由加载器解析 */
  structureRef?: string
  durationMs?: number
  label?: string
}

export interface WorldData {
  schemaVersion: number
  id: string
  frames: WorldFrame[]
  playback?: { loop?: boolean; defaultFrameIndex?: number }
}
