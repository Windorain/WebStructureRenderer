/**
 * Simple 模式下的类型定义。
 *
 * 数据流概览：
 *   JSON（layers[c][b] 与 StructureLib 一致 + 注册表）→ SimpleDefinition
 *   SimpleDefinition → VoxelGrid（get(a,b,c)，符号 → 方块 id）
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
 * 初始相机：controllerFacing 为控制器正面朝外的世界法线（FaceName）。
 * GT5U 默认朝北对应 **-z**（ExtendedFacing.DEFAULT = NORTH）。
 */
export interface InitialCameraDef {
  controllerFacing?: FaceName
  /** 相机沿正面法线到控制器中心的距离（世界单位） */
  distance?: number
}

/**
 * 与 StructureLib `StructureDefinition.Builder.addShape(name, structurePiece)` 一致：
 * `structurePiece[c][b]` 为第 c 片 slice、第 b 行，行内字符为 a（next char / next line / next slice）。
 * 体素索引 (a,b,c) 与 NORTH_DEFAULT 下世界轴对齐：a→X、b→Y、c→Z（见 ExtendedFacing）。
 */
export interface SimpleModel {
  schemaVersion: number
  mode: 'simple'
  id: string
  source?: { javaClass?: string; structurePiece?: string; note?: string }
  /** 可选：仅作文档/工具提示，不参与解析 */
  axis?: {
    sliceC?: string
    lineB?: string
    charA?: string
    spaceChar?: string
  }
  /** StructureLib 形状：`layers[c][b]`，每行字符串长度为 sizeA */
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
  /** 与 StructureLib `addShape` 一致：`layers[c][b]` */
  layers: string[][]
  symbolMap: Record<string, string>
  blocks: Record<string, BlockEntry>
  initialCamera?: InitialCameraDef
}

/**
 * 体素查询：整数格点 (a,b,c) 与 layers 下标一致；世界顶点见 simpleMesh（a≈X、b≈Y、c≈Z）。
 * get(a,b,c) 返回方块逻辑 id；空气为内部常量 'air'。
 */
export interface VoxelGrid {
  sizeA: number
  sizeB: number
  sizeC: number
  get(a: number, b: number, c: number): string
}
