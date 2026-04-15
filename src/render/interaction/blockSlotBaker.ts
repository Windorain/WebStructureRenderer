/**
 * 单方块 1×1×1 六面外露 + MC 物品栏视角组，仅由 BlockIconCache 调用以 RTT 烘焙。
 * 内含物品栏槽位矩阵（原 mcItemViewMatrix）。
 */

import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import { batchMaterialCacheKey, type BatchDescriptor } from '../mesh/batchDescriptor'
import { layersForFace, listFaceNames } from '../mesh/faceResolve'
import { FACE_NORMAL } from '../mesh/faceConstants'
import type { MaterialLibraryApi } from '../materials/simpleMaterialLibrary'
import { structureRowToWorldY } from '../data/grid'

/** 矩阵或光照变更时递增，用于缓存失效 */
export const MC_ITEM_SLOT_BAKE_REVISION = '10'

const MC_DEG = Math.PI / 180

function makeMcItemSlotBlockMatrix(): THREE.Matrix4 {
  const m = new THREE.Matrix4()
  m.identity()
  m.multiply(new THREE.Matrix4().makeScale(-1, 1, 1))
  m.multiply(new THREE.Matrix4().makeRotationZ(Math.PI))
  m.multiply(new THREE.Matrix4().makeScale(1, 1, -1))
  m.multiply(new THREE.Matrix4().makeRotationX(150 * MC_DEG))
  m.multiply(new THREE.Matrix4().makeRotationY(-45 * MC_DEG))
  return m
}

function createMcItemSlotViewRoot(): { root: THREE.Group; meshParent: THREE.Group } {
  const root = new THREE.Group()
  const g = new THREE.Group()
  g.matrixAutoUpdate = false
  g.matrix.copy(makeMcItemSlotBlockMatrix())
  g.updateMatrixWorld(true)
  root.add(g)
  return { root, meshParent: g }
}
import { collectSingleBlockModelMeshes } from '../mesh/modelMesh'
import { buildBlockMesh } from '../mesh/blockMesh'
import { quadGeometryForFace } from '../mesh/quadGeometry'
import type {
  BlockEntry,
  BlockPaletteEntry,
  LayerRole,
  MaterialPaletteEntry,
  ModelRegistryData,
  StructureDefinition,
} from '../schema/types'
import { STRUCTURE_DATA_SCHEMA_FINAL } from '../schema/types'
import { resolveFaceLayerMaterialId } from '../mesh/layerMaterialResolve'

function parseTint(hex?: string): THREE.Color {
  if (!hex) return new THREE.Color(0xffffff)
  return new THREE.Color(hex.startsWith('#') ? hex : `#${hex}`)
}

function effectiveLayerRole(layer: { layerRole?: LayerRole }, layerIdx: number): LayerRole {
  return layer.layerRole ?? (layerIdx === 0 ? 'base' : 'cutout')
}

export interface SingleBlockBakeResult {
  group: THREE.Group
  dispose: () => void
}

/**
 * 使用与结构网格相同的 1×1×1 体素坐标（column=0, row=0, zSlice=0），六面均生成面片。
 */
const AIR_ICON_PALETTE: BlockPaletteEntry = {
  registryId: 'air',
  meta: 0,
  renderMode: 'BakedQuads',
  geometry: { encoding: 'bakedQuadsJsonV1', quads: [] },
}

/**
 * 自 blockPalette 条目的烘焙几何构建物品栏视角（无 block_registry）。
 */
export async function buildSingleBlockPreviewFromBakedPalette(
  entry: BlockPaletteEntry,
  materialPalette: MaterialPaletteEntry[],
  library: MaterialLibraryApi,
): Promise<SingleBlockBakeResult> {
  const blockPalette: BlockPaletteEntry[] = [AIR_ICON_PALETTE, { ...entry, geometry: { ...entry.geometry, quads: [...entry.geometry.quads] } }]
  const miniDef: StructureDefinition = {
    schemaVersion: STRUCTURE_DATA_SCHEMA_FINAL,
    mode: 'voxelPalette',
    id: 'icon-bake',
    blockPalette,
    materialPalette,
    cellGrid: [[[1]]],
  }
  const built = await buildBlockMesh(miniDef, library, { layerPreview: 'all' })
  const { root, meshParent } = createMcItemSlotViewRoot()
  while (built.group.children.length > 0) {
    const ch = built.group.children[0]
    built.group.remove(ch)
    meshParent.add(ch)
  }
  const dispose = () => {
    built.dispose()
  }
  return { group: root, dispose }
}

export async function buildSingleBlockPreviewGroup(
  block: BlockEntry,
  library: MaterialLibraryApi,
  modelRegistry: ModelRegistryData,
): Promise<SingleBlockBakeResult> {
  const meshKind = block.meshKind
  if (meshKind === 'Unknown') {
    throw new Error('Unknown 方块无物品预览')
  }

  const sizeColumn = 1
  const sizeRow = 1
  const sizeZSlice = 1
  const column = 0
  const row = 0
  const zSlice = 0
  const voxelY = structureRowToWorldY(row, sizeRow)
  const faces = listFaceNames()

  const batches = new Map<string, { descriptor: BatchDescriptor; geometries: THREE.BufferGeometry[] }>()

  if (meshKind === 'Model') {
    collectSingleBlockModelMeshes(block, modelRegistry, batches)
  } else if (meshKind === 'SimpleCube') {
    for (const face of faces) {
      const layerDefs = layersForFace(block, face)
      if (!layerDefs.length) continue

      const n = FACE_NORMAL[face]
      layerDefs.forEach((layer, layerIdx) => {
        const descriptor: BatchDescriptor = {
          materialId: resolveFaceLayerMaterialId(layer, null),
          tint: parseTint(layer.tint),
          layerIdx,
          role: effectiveLayerRole(layer, layerIdx),
        }
        const key = batchMaterialCacheKey(descriptor)
        const geom = quadGeometryForFace(
          face,
          column,
          voxelY,
          zSlice,
          sizeColumn,
          sizeRow,
          sizeZSlice,
          n,
          layerIdx,
        )
        let bucket = batches.get(key)
        if (!bucket) {
          bucket = { descriptor, geometries: [] }
          batches.set(key, bucket)
        }
        bucket.geometries.push(geom)
      })
    }
  } else {
    throw new Error(`物品预览未实现网格策略: ${String(meshKind)}`)
  }

  const { root, meshParent } = createMcItemSlotViewRoot()

  const meshes: THREE.Mesh[] = []

  for (const { descriptor, geometries } of batches.values()) {
    if (!geometries.length) continue
    const merged = mergeGeometries(geometries, false)
    if (!merged) continue
    const mat = await library.getMaterialForBatch(descriptor)
    const mesh = new THREE.Mesh(merged, mat)
    mesh.renderOrder = descriptor.layerIdx
    meshParent.add(mesh)
    meshes.push(mesh)
  }

  const dispose = () => {
    for (const m of meshes) {
      m.geometry.dispose()
    }
  }

  return { group: root, dispose }
}

/** 用于缓存失效：对 blockPalette 做稳定摘要（无加密，仅变更检测） */
export function summarizeBlocksForCache(def: StructureDefinition): string {
  return def.blockPalette.map((e, i) => `${i}:${e.registryId}@${e.meta}`).join('|')
}
