/**
 * 体素路径：cellGrid → blockPalette[i].geometry（有序 BakedQuads）+ materialPalette。
 */

import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import type {
  BakedQuad,
  FaceName,
  MaterialBlendMode,
  MaterialPaletteEntry,
  StructureDefinition,
  VoxelVolume,
} from '../schema/types'
import { isAirState } from '../schema/types'
import { buildVoxelVolume } from '../data/grid'
import type { MaterialLibraryApi } from '../materials/simpleMaterialLibrary'
import { structureRowToWorldY } from '../data/grid'
import { effectiveVoxelState, type LayerPreviewMode } from '../data/layerPreview'
import { machineFrontQuaternion, vec3ToFaceName } from './facingMap'
import { decodeBakedGeometry } from './bakedGeometryDecode'
import { batchMaterialCacheKey, type BatchDescriptor } from './batchDescriptor'

export interface BuildBlockMeshOptions {
  layerPreview?: LayerPreviewMode
  /** World 当前帧前缀，如 `"2:"`，与 buildMaterialRegistryFromSceneDocument 的 materialId 一致 */
  materialKeyPrefix?: string
}

function parseTintFromArgb(argb: number | undefined): THREE.Color {
  if (argb === undefined || !Number.isFinite(argb)) return new THREE.Color(0xffffff)
  const a = (argb >>> 24) & 0xff
  const r = (argb >>> 16) & 0xff
  const g = (argb >>> 8) & 0xff
  const b = argb & 0xff
  if (a < 8) return new THREE.Color(0xffffff)
  return new THREE.Color(r / 255, g / 255, b / 255)
}

/** prepare 后应有 blend；`??` 仅防御未走 hydrate 的调用路径 */
function materialBlendModeFromPaletteEntry(entry: MaterialPaletteEntry): MaterialBlendMode {
  return entry.blend ?? 'opaque'
}

/** 局部 [0,1]³ 顶点绕块中心按 facing 旋转 */
function transformLocalPoint(
  x: number,
  y: number,
  z: number,
  facing: import('../schema/types').FaceName | undefined,
  out: THREE.Vector3,
): void {
  out.set(x, y, z)
  if (!facing || facing === '-z') return
  const c = 0.5
  out.x -= c
  out.y -= c
  out.z -= c
  out.applyQuaternion(machineFrontQuaternion(facing))
  out.x += c
  out.y += c
  out.z += c
}

/** 外法线 worldFace 指向的邻格相对当前体素的 (column,row,zSlice) 增量 */
function gridStepForOutwardWorldFace(f: FaceName): { dc: number; dr: number; dz: number } {
  switch (f) {
    case '+x':
      return { dc: 1, dr: 0, dz: 0 }
    case '-x':
      return { dc: -1, dr: 0, dz: 0 }
    case '+y':
      return { dc: 0, dr: -1, dz: 0 }
    case '-y':
      return { dc: 0, dr: 1, dz: 0 }
    case '+z':
      return { dc: 0, dr: 0, dz: 1 }
    case '-z':
      return { dc: 0, dr: 0, dz: -1 }
  }
}

/** 由四边形顶点估计朝外的轴对齐世界面；非法线或退化时返回 null（不剔除） */
function outwardWorldFaceFromBakedQuad(
  quad: BakedQuad,
  col: number,
  row: number,
  zSlice: number,
  sizeColumn: number,
  sizeRow: number,
  sizeZSlice: number,
  facing: FaceName | undefined,
): FaceName | null {
  const v = quad.vertices
  if (!v || v.length !== 4) return null
  const voxelY = structureRowToWorldY(row, sizeRow)
  const ox = col - sizeColumn / 2
  const oy = voxelY - sizeRow / 2
  const oz = zSlice - sizeZSlice / 2
  const blockCenter = new THREE.Vector3(ox + 0.5, oy + 0.5, oz + 0.5)
  const corners = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]
  for (let i = 0; i < 4; i++) {
    transformLocalPoint(v[i].x, v[i].y, v[i].z, facing, corners[i])
    corners[i].x += ox
    corners[i].y += oy
    corners[i].z += oz
  }
  const e1 = corners[1].clone().sub(corners[0])
  const e2 = corners[2].clone().sub(corners[0])
  const n = e1.cross(e2)
  if (n.lengthSq() < 1e-12) return null
  n.normalize()
  const quadCenter = corners[0]
    .clone()
    .add(corners[1])
    .add(corners[2])
    .add(corners[3])
    .multiplyScalar(0.25)
  if (n.dot(quadCenter.clone().sub(blockCenter)) < 0) n.negate()
  return vec3ToFaceName(n)
}

function shouldCullQuadFacingOpaqueNeighbor(
  def: StructureDefinition,
  volume: VoxelVolume,
  layerPreview: LayerPreviewMode,
  col: number,
  row: number,
  zSlice: number,
  sizeRow: number,
  worldFace: FaceName,
): boolean {
  const { dc, dr, dz } = gridStepForOutwardWorldFace(worldFace)
  const ncol = col + dc
  const nrow = row + dr
  const nz = zSlice + dz
  const nState = effectiveVoxelState(volume, ncol, nrow, nz, sizeRow, layerPreview)
  if (isAirState(nState)) return false
  const idx = def.cellGrid[nz]?.[nrow]?.[ncol]
  if (idx === undefined || idx < 0 || idx >= def.blockPalette.length) return false
  return def.blockPalette[idx].occludesAdjacentFaces === true
}

function bufferGeometryFromBakedQuad(
  quad: BakedQuad,
  col: number,
  row: number,
  zSlice: number,
  sizeColumn: number,
  sizeRow: number,
  sizeZSlice: number,
  facing: import('../schema/types').FaceName | undefined,
  globalQuadIndex: number,
): THREE.BufferGeometry | null {
  const v = quad.vertices
  if (!v || v.length !== 4) return null
  const voxelY = structureRowToWorldY(row, sizeRow)
  const ox = col - sizeColumn / 2
  const oy = voxelY - sizeRow / 2
  const oz = zSlice - sizeZSlice / 2
  const tmp = new THREE.Vector3()
  const positions = new Float32Array(18)
  const uvs = new Float32Array(12)
  const triCorners = [
    [0, 1, 2],
    [0, 2, 3],
  ] as const
  let pi = 0
  let ui = 0
  for (const [i0, i1, i2] of triCorners) {
    for (const i of [i0, i1, i2]) {
      const p = v[i]
      transformLocalPoint(p.x, p.y, p.z, facing, tmp)
      positions[pi++] = tmp.x + ox
      positions[pi++] = tmp.y + oy
      positions[pi++] = tmp.z + oz
      uvs[ui++] = p.u
      uvs[ui++] = p.v
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  g.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
  g.computeVertexNormals()
  g.userData.globalQuadIndex = globalQuadIndex
  return g
}

export interface UndefinedBlockDetail {
  registryKey: string
  reason: 'special_no_geometry' | 'decode_error'
  voxelCount: number
}

export interface BlockMeshBuildStats {
  nonAirVoxelCount: number
  skippedUnmappedCount: number
  unknownVoxelCount: number
  undefinedBlockDetails: UndefinedBlockDetail[]
}

export interface BlockMeshResult {
  group: THREE.Group
  dispose: () => void
  stats: BlockMeshBuildStats
}

interface QuadWorkUnit {
  materialIndex: number
  geom: THREE.BufferGeometry
  quadOrder: number
  matPalette: MaterialPaletteEntry
  tint: THREE.Color
}

export async function buildBlockMesh(
  def: StructureDefinition,
  library: MaterialLibraryApi,
  options?: BuildBlockMeshOptions,
): Promise<BlockMeshResult> {
  const layerPreview: LayerPreviewMode = options?.layerPreview ?? 'all'
  const matPrefix = options?.materialKeyPrefix
  const volume = buildVoxelVolume(def)
  const { sizeColumn, sizeRow, sizeZSlice } = volume
  const { blockPalette, materialPalette } = def

  let quadSerial = 0
  const workUnits: QuadWorkUnit[] = []
  let nonAirVoxelCount = 0
  let skippedUnmappedCount = 0
  const undefinedDetails = new Map<string, UndefinedBlockDetail>()

  for (let zSlice = 0; zSlice < sizeZSlice; zSlice++) {
    for (let row = 0; row < sizeRow; row++) {
      for (let col = 0; col < sizeColumn; col++) {
        const state = effectiveVoxelState(volume, col, row, zSlice, sizeRow, layerPreview)
        if (isAirState(state)) continue

        nonAirVoxelCount++
        const idx = def.cellGrid[zSlice][row][col]
        const entry = blockPalette[idx]
        if (entry.renderMode === 'Special') {
          skippedUnmappedCount++
          const k = `${entry.registryId}@${entry.meta}`
          const prev = undefinedDetails.get(k)
          undefinedDetails.set(k, {
            registryKey: k,
            reason: 'special_no_geometry',
            voxelCount: (prev?.voxelCount ?? 0) + 1,
          })
          continue
        }

        let quads: BakedQuad[]
        try {
          quads = decodeBakedGeometry(entry.geometry)
        } catch {
          skippedUnmappedCount++
          const k = `${entry.registryId}@${entry.meta}`
          const prev = undefinedDetails.get(k)
          undefinedDetails.set(k, {
            registryKey: k,
            reason: 'decode_error',
            voxelCount: (prev?.voxelCount ?? 0) + 1,
          })
          continue
        }

        for (let qi = 0; qi < quads.length; qi++) {
          const q = quads[qi]
          const worldFace = outwardWorldFaceFromBakedQuad(
            q,
            col,
            row,
            zSlice,
            sizeColumn,
            sizeRow,
            sizeZSlice,
            entry.facing ?? state.facing,
          )
          if (
            worldFace !== null &&
            entry.occludesAdjacentFaces === true &&
            shouldCullQuadFacingOpaqueNeighbor(def, volume, layerPreview, col, row, zSlice, sizeRow, worldFace)
          ) {
            continue
          }
          const mi = q.materialIndex
          const matPal = materialPalette[mi]
          const g = bufferGeometryFromBakedQuad(
            q,
            col,
            row,
            zSlice,
            sizeColumn,
            sizeRow,
            sizeZSlice,
            entry.facing ?? state.facing,
            quadSerial++,
          )
          if (!g) continue
          workUnits.push({
            materialIndex: mi,
            geom: g,
            quadOrder: (g.userData.globalQuadIndex as number) ?? 0,
            matPalette: matPal,
            tint: parseTintFromArgb(q.vertices[0]?.color),
          })
        }
      }
    }
  }

  const batches = new Map<string, { descriptor: BatchDescriptor; units: QuadWorkUnit[] }>()
  for (const w of workUnits) {
    const descriptor: BatchDescriptor = {
      materialId:
        matPrefix !== undefined ? `${matPrefix}${w.materialIndex}` : String(w.materialIndex),
      tint: w.tint,
      blend: materialBlendModeFromPaletteEntry(w.matPalette),
    }
    const key = batchMaterialCacheKey(descriptor)
    let b = batches.get(key)
    if (!b) {
      b = { descriptor, units: [] }
      batches.set(key, b)
    }
    b.units.push(w)
  }

  for (const b of batches.values()) {
    b.units.sort((a, c) => a.quadOrder - c.quadOrder)
  }

  const sortedBatchEntries = [...batches.entries()].sort(([, a], [, c]) => {
    const oa = a.units[0]?.quadOrder ?? 0
    const oc = c.units[0]?.quadOrder ?? 0
    return oa - oc
  })

  const group = new THREE.Group()
  const meshes: THREE.Mesh[] = []

  let batchIdx = 0
  for (const [, bucket] of sortedBatchEntries) {
    const geoms = bucket.units.map((x) => x.geom)
    const merged = mergeGeometries(geoms, false)
    if (!merged) continue
    const mat = await library.getMaterialForBatch(bucket.descriptor)
    const mesh = new THREE.Mesh(merged, mat)
    const minOrder = bucket.units.reduce((m, u) => Math.min(m, u.quadOrder), Number.POSITIVE_INFINITY)
    mesh.renderOrder = Number.isFinite(minOrder) ? Math.floor(minOrder) : batchIdx
    group.add(mesh)
    meshes.push(mesh)
    batchIdx++
  }

  const dispose = () => {
    for (const m of meshes) {
      m.geometry.dispose()
    }
  }

  const undefinedBlockDetails = [...undefinedDetails.values()].sort((a, b) =>
    a.registryKey.localeCompare(b.registryKey),
  )

  return {
    group,
    dispose,
    stats: {
      nonAirVoxelCount,
      skippedUnmappedCount,
      unknownVoxelCount: 0,
      undefinedBlockDetails,
    },
  }
}

const STATUS_DETAIL_MAX = 520

export function formatUndefinedBlockDetailsForStatus(details: UndefinedBlockDetail[]): string {
  if (!details.length) return ''
  const segments: string[] = []
  for (const d of details) {
    const tag = d.reason === 'decode_error' ? 'DECODE' : 'SPECIAL'
    segments.push(`${tag} ${d.registryKey}×${d.voxelCount}`)
  }
  let out = ` · ${segments.join('；')}`
  if (out.length > STATUS_DETAIL_MAX) {
    out = `${out.slice(0, STATUS_DETAIL_MAX - 1)}…`
  }
  return out
}
