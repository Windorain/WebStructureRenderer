/**
 * 体素路径：cellGrid → blockPalette[i].geometry（有序 BakedQuads）+ materialPalette。
 */

import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import type { BakedQuad, LayerRole, MaterialPaletteEntry, StructureDefinition } from '../schema/types'
import { isAirState } from '../schema/types'
import { buildVoxelVolume } from '../data/grid'
import type { MaterialLibraryApi } from '../materials/simpleMaterialLibrary'
import { structureRowToWorldY } from '../data/grid'
import { effectiveVoxelState, type LayerPreviewMode } from '../data/layerPreview'
import { machineFrontQuaternion } from './facingMap'
import { decodeBakedGeometry } from './bakedGeometryDecode'
import { batchMaterialCacheKey, type BatchDescriptor } from './batchDescriptor'

export interface BuildBlockMeshOptions {
  layerPreview?: LayerPreviewMode
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

function inferLayerRole(entry: MaterialPaletteEntry, _quadIdx: number): LayerRole {
  const b = entry.blend
  if (b === 'cutout' || b === 'translucent') return 'cutout'
  return 'base'
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
      materialId: String(w.materialIndex),
      tint: w.tint,
      layerIdx: 0,
      role: inferLayerRole(w.matPalette, 0),
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
