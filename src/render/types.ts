/**
 * Simple 模式（mode=simple）下的类型定义。
 *
 * 数据流概览：
 *   磁盘 JSON（StructureData）→ mergeStructureData + block_registry → StructureDefinition
 *   StructureDefinition → VoxelGrid（get(a,b,c)，符号 → 方块 id）
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
 *
 * 磁盘上的结构描述（不含方块外观表；外观由 `data/registries/block_registry.json` 合并）。
 */
export interface StructureData {
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
 * 合并 block_registry 后的运行时定义：形状 + 符号表 + 方块外观表。
 */
export interface StructureDefinition {
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
 * 体素查询：(a, b, c) 与 `layers[c][b][a]` 一致；b 为 StructureLib 行下标（0=GT 首行=顶）。
 * 世界 Y 与 b 的映射见 `structureRowToWorldY`。get(a,b,c) 返回方块逻辑 id；空气为 'air'。
 */
export interface VoxelGrid {
  sizeA: number
  sizeB: number
  sizeC: number
  get(a: number, b: number, c: number): string
}
