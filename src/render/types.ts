/**
 * Simple 模式下的类型定义。
 *
 * 数据流概览：
 *   JSON（模型 + 注册表）→ SimpleDefinition
 *   SimpleDefinition → VoxelGrid（符号 → 方块 id）
 *   方块 id + BlockEntry → 面与材质层 → Three.js 网格
 */

/** 资源包定位符：namespace:path（不含 textures/ 与 .png），与 MC 习惯一致 */
export type ResourceLocator = string

export type MaterialKind = 'static16' | 'animated'

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

/** 方块在六个方向上的贴图层；可只写 all 表示六面相同 */
export interface BlockEntry {
  label?: string
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
 * data/models 下的纯结构体（不含方块外观）。
 * 外观由 block_registry 在合并阶段注入。
 */
/**
 * 初始相机：存在控制器方块时，注视其体素中心，并从「正面」外侧观察。
 * controllerFacing 为控制器**正面**朝外的世界空间法线（与 FaceName 一致）。
 * 与 GT5U 一致时默认朝北，对应 **-z**（StructureLib ExtendedFacing.DEFAULT = NORTH）。
 */
export interface InitialCameraDef {
  controllerFacing?: FaceName
  /** 相机沿正面法线到控制器中心的距离（世界单位） */
  distance?: number
}

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
  /** 可选：有控制器时用于对准正面与轨道中心 */
  initialCamera?: InitialCameraDef
}

/**
 * Simple 渲染器使用的运行时定义：多层结构 + 符号表 + 已合并的方块外观表。
 */
export interface SimpleDefinition {
  schemaVersion: number
  mode: 'simple'
  id: string
  layers: string[][]
  symbolMap: Record<string, string>
  blocks: Record<string, BlockEntry>
  initialCamera?: InitialCameraDef
}

/**
 * 体素查询接口：坐标为整数格点，原点在模型包围盒中心附近（见 simpleMesh 中顶点公式）。
 * get(x,y,z) 返回方块逻辑 id；空气为内部常量 'air'。
 */
export interface VoxelGrid {
  sizeX: number
  sizeY: number
  sizeZ: number
  get(x: number, y: number, z: number): string
}
