/**
 * Simple 模式（mode=simple）下的类型定义。
 *
 * **结构 JSON schemaVersion**：`5` 起形状字段为 `zSlices`（Wiki 体素轴，见 `StructureData`）；`4` 已废弃。
 *
 * 数据流概览：
 *   磁盘 JSON（StructureData）→ mergeStructureData + block_registry → StructureDefinition
 *   StructureDefinition → VoxelGrid（get(column,row,zSlice)，符号 → 方块 id）
 *   assets/resolveAssets：locator → PNG URL / mcmeta 原文
 *   SimpleMaterialLibrary：注册表 + 纹理 / mcmeta → MeshStandardMaterial，tick 驱动动画
 *   simpleMesh：体素 → BatchDescriptor 合并批次；面几何/UV 与 Forge 约定对齐（见 faceConstants、blockFaceUv）
 *   viewport/RenderViewport：WebGLRenderer + 透视/正交相机与 OrbitControls（与场景内容无关）
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
 * 方块几何生成策略；缺省为 SimpleCube（六面体素 + 面贴图）。
 * 后续可扩展用于管道、自定义 mesh 等。
 */
export type BlockRendererKind = 'SimpleCube'

/** 方块在六个方向上的贴图层；可只写 all 表示六面相同。面专属层与 `all` 合并，见 `layersForFace`。 */
export interface BlockEntry {
  label?: string
  /** 长说明；与 `label` 可同时存在，tooltip 中分行展示 */
  description?: string
  /** 缺省为 `SimpleCube` */
  renderer?: BlockRendererKind
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
 * - `focusBlockId`：与 `symbolMap` 的值一致，网格中第一个匹配体素为焦点。
 * - `frontFace`：机器正面朝外的世界法线（默认朝北为 **-z**）。
 */
export interface InitialCameraDef {
  focusBlockId: string
  frontFace: FaceName
  /** 相机沿正面法线到焦点体素中心的距离；省略时由运行时默认 */
  distance?: number
}

/**
 * Wiki 结构数据（磁盘 JSON，不含方块外观表）。
 *
 * **`zSlices`**：`zSlices[i]` 为沿 **世界 Z** 的第 i 个水平截面；每个截面为从上到下的 **行** 数组；
 * **行 0 = 结构几何顶部**（最高世界 Y）；行内字符从左到右为 **世界 X**（列）。
 * 索引 i 增大方向与渲染中体素中心 `zSlice + 0.5 - sizeZSlice/2` 一致（见 `voxelCenterWorld`）。
 *
 * 上游 GT / StructureLib 与本书写约定不同时，由仓库外 `scripts/` 适配层转换后再写入本格式。
 */
export interface StructureData {
  /** 当前简单结构格式为 `5`（`zSlices` + `initialCamera` 形状） */
  schemaVersion: number
  mode: 'simple'
  id: string
  source?: { javaClass?: string; structurePiece?: string; note?: string }
  /** 可选：仅作文档/工具提示，不参与解析 */
  axis?: {
    /** 沿世界 Z 堆叠的切片下标 */
    zSlice?: string
    /** 截面内行下标；0 = 顶行 */
    row?: string
    /** 行内列 / 世界 X */
    column?: string
    spaceChar?: string
  }
  /**
   * 沿 Z 的切片序列；`zSlices[i][row][col]` 为字符，经 `symbolMap` 映射为方块 id。
   * 类型上等价于 `string[][]`：外层 = Z 切片，中层 = 行，内层字符串 = 一行列字符。
   */
  zSlices: string[][]
  symbolMap: Record<string, string>
  initialCamera?: InitialCameraDef
}

/**
 * 合并 block_registry 后的运行时定义：形状 + 符号表 + 方块外观表。
 */
export interface StructureDefinition {
  schemaVersion: number
  mode: 'simple'
  id: string
  zSlices: string[][]
  symbolMap: Record<string, string>
  blocks: Record<string, BlockEntry>
  initialCamera?: InitialCameraDef
}

/**
 * 体素查询：索引 (column, row, zSlice) 与 `zSlices[zSlice][row][column]` 一致；
 * **row 0 = 顶行**（最高 Y）。`get` 返回方块逻辑 id；空气为 `air`。
 */
export interface VoxelGrid {
  /** 单行字符长度（列数 / 世界 X 方向格数） */
  sizeColumn: number
  /** 每个 Z 切片内的行数（世界 Y 方向格数） */
  sizeRow: number
  /** Z 切片个数（世界 Z 方向格数） */
  sizeZSlice: number
  get(column: number, row: number, zSlice: number): string
}
