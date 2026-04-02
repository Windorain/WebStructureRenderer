/**
 * Simple / voxelPalette 模式下的类型定义。
 *
 * 数据流：HTTP 拉取 `RenderBundle` → 校验 → `resolveRenderBundle` → StructureDefinition；
 * 纹理经 `/preview-api/resources/...` 预取后注入 SimpleMaterialLibrary；材质动画参数以 `material_registry` 为准。
 */

/** 资源包定位符：namespace:path（不含 textures/ 与 .png），与 MC 习惯一致 */
export type ResourceLocator = string

export type MaterialKind = 'static16' | 'animated'

export type MaterialBlendMode = 'opaque' | 'cutout' | 'translucent'

/** 与 mcmeta `animation` 对齐；缺省时 `kind === 'animated'` 且多帧 PNG 按顺序 1 tick/帧播放 */
export interface MaterialAnimationSpec {
  /** 默认每帧持续 tick 数（1 tick = 50ms）；缺省 1 */
  defaultFrametimeTicks?: number
  frameSequence?: Array<{ index: number; timeTicks?: number }>
  interpolate?: boolean
}

export interface MaterialEntry {
  locator: ResourceLocator
  kind: MaterialKind
  /** 混合模式提示；缺省由 layerRole / kind 推断 */
  blend?: MaterialBlendMode
  /** 发光提示（0–1 或 bool 语义由渲染侧解释） */
  emissive?: number
  /** 竖直帧条动画；静态材质可省略 */
  animation?: MaterialAnimationSpec
}

/** material_registry.json 根结构 */
export interface MaterialRegistryData {
  schemaVersion?: number
  materials: Record<string, MaterialEntry>
}

/**
 * 一次下发的渲染包：`document` 为 **StructureData** 或 **World**（JSON 顶层）；注册表由服务端/Mock 预先定稿。
 */
export interface RenderBundle {
  /** 可选；契约版本 */
  payloadSchemaVersion?: number
  /** 单结构 JSON 或 World 多帧文档（内嵌帧须含 `structure`） */
  document: unknown
  blockRegistry: BlockRegistryData
  materialRegistry: MaterialRegistryData
  /** 方块模型注册表；无 Model 方块时可 `models: {}` */
  modelRegistry: ModelRegistryData
  bundleId?: string
  assetsBaseUrl?: string
}

export type FaceName = '+x' | '-x' | '+y' | '-y' | '+z' | '-z'

/** 多层贴花时：底层不透明，上层可透明镂空；`glass` 与 `cutout` 在材质上同义（alpha 镂空） */
export type LayerRole = 'base' | 'cutout' | 'glass'

/**
 * 构建时按体素邻接解析最终材质；无邻接上下文（如物品栏单块预览）时回退到 `fallbackMaterialId` 或 `materialId`。
 */
export interface MaterialResolveNeighborShell {
  type: 'neighborShell'
  /** palette 键（`registryId@meta` 或 `blockRegistryKeyForPalette` 形式）→ material_registry 键 */
  casingToMaterialId: Record<string, string>
  /** 无邻格命中时使用；缺省为同层 `materialId` */
  fallbackMaterialId?: string
}

/**
 * 标记仓室壳层需用结构 `palette[].shellMaterialId`（SDE 世界采样）作为唯一可信 locator；与 `neighborShell` 二选一。
 * 渲染端不再推断邻格；无 `shellMaterialId` 时用 `fallbackMaterialId` 或同层 `materialId`。
 */
export interface MaterialResolveNeighborShellBlock {
  type: 'neighborShellBlock'
  fallbackMaterialId?: string
}

export type MaterialResolveRule = MaterialResolveNeighborShell | MaterialResolveNeighborShellBlock

export interface FaceLayerDef {
  materialId: string
  tint?: string
  layerRole?: LayerRole
  /** 若存在，SimpleCube 网格构建时解析为最终 `materialId`（`neighborShell` 邻格映射；`neighborShellBlock` 用 palette.shellMaterialId） */
  materialResolve?: MaterialResolveRule
}

export interface FaceLayersDef {
  layers: FaceLayerDef[]
}

/**
 * 方块几何构建策略（非 Three.js WebGLRenderer）。
 * `Model`：使用 `model_registry` 中 `modelId` 对应条目（与 MC 方块模型 JSON 子集对齐）。
 * `Unknown`：网格阶段跳过体素。
 */
export type BlockMeshKind = 'SimpleCube' | 'Model' | 'Unknown'

/** 方块在六个方向上的贴图层；可只写 all 表示六面相同。面专属层与 `all` 合并，见 `layersForFace`。SimpleCube 必填；Model 可省略（图标等走 model）。 */
export interface BlockEntry {
  label?: string
  /** 长说明；与 `label` 可同时存在，tooltip 中分行展示 */
  description?: string
  meshKind: BlockMeshKind
  /** `meshKind === 'Model'` 时指向 model_registry.models 的键 */
  modelId?: string
  /** 与 SDE GregTech 注册策略一一对应（如 `gregtech.frame`）；仅标识来源，不参与渲染分支 */
  renderProfile?: string
  /**
   * 当本格作为**邻格**时是否遮挡另一侧体素朝向本格的外露面；缺省 `true`。
   * 玻璃等须为 `false`。
   */
  occludesAdjacentFaces?: boolean
  faces?: {
    all?: FaceLayersDef
  } & Partial<Record<FaceName, FaceLayersDef>>
}

/** MC 模型轴向面名（north = −Z 外法线，与官方 block/model 一致） */
export type ModelFaceName = 'north' | 'south' | 'east' | 'west' | 'up' | 'down'

/** 模型单面上的贴图层（可与 BlockEntry 面语义一致，用于基底 + cutout） */
export interface ModelFaceLayerDef {
  /** `#materialId` */
  texture: string
  layerRole?: LayerRole
  /** 与 BlockEntry 面 tint 一致，如 `#ffffff` */
  tint?: string
}

/** 模型中单面：单纹理简写或贴图层列表 */
export interface ModelElementFaceDef {
  texture?: string
  layers?: ModelFaceLayerDef[]
  /** 纹理矩形，0–16 像素空间；省略则整面 0–1 UV */
  uv?: [number, number, number, number]
}

export interface ModelElement {
  /** MC 模型坐标 0–16；JSON 解析为 number[] */
  from: number[]
  to: number[]
  faces?: Partial<Record<ModelFaceName, ModelElementFaceDef>>
}

export interface ModelDocument {
  elements: ModelElement[]
}

/** model_registry.json 根结构 */
export interface ModelRegistryData {
  schemaVersion?: number
  models: Record<string, ModelDocument>
}

/** block_registry.json 根结构 */
export interface BlockRegistryData {
  schemaVersion?: number
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
 * 可选 `facing`：机器正面在世界中的外法线；缺省为 `-z`（北），与 block_registry 以北为正面烘焙一致。
 */
export interface VoxelState {
  registryId: string
  meta: number
  /** 正面外法线；省略时与旧数据一致，等价于朝北 `-z` */
  facing?: FaceName
  /** GT 仓室壳层材质（与 material_registry 键一致）；由 SDE 扫描写入，供 `neighborShellBlock` 解析 */
  shellMaterialId?: string
  nbt?: JsonNbt
}

/** 与磁盘 palette 中空气条目一致 */
export const AIR_VOXEL: VoxelState = { registryId: 'air', meta: 0 }

/** 与磁盘/合并后 `palette` 中空气条目一致时使用 */
export function isAirState(v: VoxelState): boolean {
  return v.registryId === 'air'
}

/**
 * 磁盘结构数据：调色板 + 三维整数网格（palette 下标）。
 * `cellGrid[zSlice][row][column]`，轴约定与旧版 zSlices 相同。
 */
export interface StructureData {
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
  schemaVersion?: number
  mode: 'voxelPalette'
  id: string
  palette: VoxelState[]
  cellGrid: number[][][]
  blocks: Record<string, BlockEntry>
  /** 与 bundle 合并后的模型表，供 Model 网格使用 */
  modelRegistry: ModelRegistryData
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

/**
 * 逻辑一帧：内嵌 StructureData 或引用外部文件（由加载器解析）。
 */
export interface Frame {
  /** 可选；与数组下标一致时可省略 */
  index?: number
  /** 内嵌单帧结构；与 structureRef 二选一 */
  structure?: StructureData
  /** 相对场景根的路径或 id，由加载器解析（如 data/scenes） */
  structureRef?: string
  durationMs?: number
  label?: string
}

/** 多帧世界文档（磁盘 JSON）；与单文件 StructureData 区分：含 `frames`。 */
export interface World {
  schemaVersion?: number
  id: string
  frames: Frame[]
  playback?: { loop?: boolean; defaultFrameIndex?: number }
}
