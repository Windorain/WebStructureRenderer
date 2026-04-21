/**
 * 工作台：OBJ + MTL + textures/（ZIP）适配层。
 * 几何/序列化核心见 `src/render/mesh/*`；此处负责解码贴图、JSZip、按模式组装。
 */

import JSZip from 'jszip'

import { buildBlobIndexToUvRect, packTextureGrid } from '@/render/mesh/atlasLayout'
import { clusterAllPiecesForBlockExport } from '@/render/mesh/coplanarOverlapCluster'
import { mergeBakedQuadsWithinVoxelBucket } from '@/render/mesh/inVoxelQuadMerge'
import {
  type ObjExportMesh,
  serializeMtl,
  serializeObjMeshes,
  type MtlSerializedEntry,
} from '@/render/mesh/objExportSerialize'
import {
  collectStructureGeometryPiecesPure,
  mergeBakedQuadPiecesAttributes,
  type BakedQuadGeometryPiece,
} from '@/render/mesh/structureGeometryCore'
import { labelVoxelComponents } from '@/render/mesh/voxelComponents'
import { isWorldDocument } from '@/render/data/bundleResolve'
import { getDefaultFrameIndex } from '@/render/data/worldPlayback'
import type { BuildBlockMeshOptions } from '@/render/mesh/blockMesh'
import type { MaterialBlendMode, MaterialPaletteEntry, StructureDefinition } from '@/render/schema/types'

import {
  compositeCoplanarCluster,
  mergedMaterialBlendForCluster,
} from '@/workbench/coplanarTextureComposite'
import {
  measureTextureBlobFirstFrame,
  rasterizeAtlasToPngBlob,
  textureBlobToFirstFramePngBlob,
} from '@/workbench/textureAtlasRaster'

const OBJ_NAME = 'structure.obj'
const MTL_NAME = 'structure.mtl'

const DEFAULT_ATLAS_MAX_SIDE = 4096

export type StructureBundleExportMode = 'block' | 'connected'

export interface StructureBundleExportOptions extends BuildBlockMeshOptions {
  /** World 文档时覆盖默认帧 */
  worldFrameIndex?: number
  /** `block`：体素内合并；`connected`：连通域外表面 + 每域单 atlas */
  mode?: StructureBundleExportMode
  /** 连通模式纹理图集最大边长（像素） */
  atlasMaxSide?: number
}

function paletteMaterialId(
  document: unknown,
  frameIndex: number | undefined,
  materialIndex: number,
): string {
  if (isWorldDocument(document)) {
    const fi = frameIndex !== undefined ? Math.floor(frameIndex) : getDefaultFrameIndex(document)
    return `${fi}:${materialIndex}`
  }
  return String(materialIndex)
}

function sanitizeNewmtlName(id: string): string {
  return `m_${id.replace(/[^a-zA-Z0-9]+/g, '_')}`
}

function textureZipPath(blobIndex: number): string {
  return `textures/blob_${blobIndex}.png`
}

function mtlDissolveAndIllum(blend: MaterialBlendMode | undefined): { d: number; illum: number } {
  if (blend === 'translucent') return { d: 0.92, illum: 4 }
  return { d: 1, illum: 1 }
}

function remapUvsToAtlasRect(
  uvs: Float32Array,
  blobIndex: number,
  blobToRect: Map<number, { u0: number; v0: number; u1: number; v1: number }>,
): Float32Array {
  const rect = blobToRect.get(blobIndex)
  if (!rect) return new Float32Array(uvs)
  const out = new Float32Array(uvs.length)
  for (let i = 0; i < uvs.length; i += 2) {
    const u = uvs[i]!
    const v = uvs[i + 1]!
    out[i] = rect.u0 + u * (rect.u1 - rect.u0)
    out[i + 1] = rect.v0 + v * (rect.v1 - rect.v0)
  }
  return out
}

export async function buildStructureBundleZip(
  def: StructureDefinition,
  normalizedDocument: unknown,
  options?: StructureBundleExportOptions,
): Promise<Blob> {
  const mode = options?.mode ?? 'block'
  if (mode === 'connected') {
    return buildStructureBundleZipConnected(def, normalizedDocument, options)
  }
  return buildStructureBundleZipBlock(def, normalizedDocument, options)
}

function sortExportClusters(clusters: BakedQuadGeometryPiece[][]): BakedQuadGeometryPiece[][] {
  return [...clusters].sort((a, b) => {
    const pa = a[0]!
    const pb = b[0]!
    if (pa.zSlice !== pb.zSlice) return pa.zSlice - pb.zSlice
    if (pa.row !== pb.row) return pa.row - pb.row
    if (pa.col !== pb.col) return pa.col - pb.col
    return (
      Math.min(...a.map((x) => x.quadOrder)) - Math.min(...b.map((x) => x.quadOrder))
    )
  })
}

async function buildStructureBundleZipBlock(
  def: StructureDefinition,
  normalizedDocument: unknown,
  options?: StructureBundleExportOptions,
): Promise<Blob> {
  const { pieces, stats } = collectStructureGeometryPiecesPure(def, {
    ...options,
    cullOccludedQuads: false,
  })

  const frameIdx = isWorldDocument(normalizedDocument)
    ? (options?.worldFrameIndex ?? getDefaultFrameIndex(normalizedDocument))
    : undefined

  const blobs = extractTextureBlobs(normalizedDocument)

  const clusters = sortExportClusters(clusterAllPiecesForBlockExport(pieces))

  const objMeshes: ObjExportMesh[] = []
  const mtlEntries: MtlSerializedEntry[] = []
  const seenMtlName = new Set<string>()
  let coplanarMergeSerial = 0

  function pushMtlOnce(entry: MtlSerializedEntry): void {
    if (seenMtlName.has(entry.name)) return
    seenMtlName.add(entry.name)
    mtlEntries.push(entry)
  }

  const blobIndices = new Set<number>()
  const mergedPngFiles: Array<{ path: string; blob: Blob }> = []

  for (const cluster of clusters) {
    const head = cluster[0]!
    const { col, row, zSlice } = head

    if (cluster.length === 1) {
      const units = [...cluster].sort((a, b) => a.quadOrder - b.quadOrder)
      const mergedAttrs = mergeBakedQuadsWithinVoxelBucket(units)
      const mi = head.materialIndex
      const mname = sanitizeNewmtlName(paletteMaterialId(normalizedDocument, frameIdx, mi))
      const entry = def.materialPalette[mi]
      const { d, illum } = mtlDissolveAndIllum(entry?.blend)
      let mapKd: string | undefined
      if (
        entry &&
        typeof entry.textureBlobIndex === 'number' &&
        Number.isFinite(entry.textureBlobIndex) &&
        blobs[Math.floor(entry.textureBlobIndex)]
      ) {
        const bi = Math.floor(entry.textureBlobIndex)
        blobIndices.add(bi)
        mapKd = textureZipPath(bi)
      }
      pushMtlOnce({ name: mname, d, illum, mapKd })
      objMeshes.push({
        objectName: `block_${col}_${row}_${zSlice}_mat${mi}`,
        materialName: mname,
        positions: mergedAttrs.positions,
        uvs: mergedAttrs.uvs,
        colors: mergedAttrs.colors,
      })
    } else {
      const mergeId = coplanarMergeSerial++
      const comp = await compositeCoplanarCluster(cluster, def, blobs, mergeId)
      mergedPngFiles.push({ path: comp.pngFileName, blob: comp.pngBlob })
      const mergedAttrs = mergeBakedQuadPiecesAttributes(comp.mergedPieces)
      const rep = mergedMaterialBlendForCluster(cluster, def)
      const mname = sanitizeNewmtlName(`merged_coplanar_${mergeId}`)
      const { d, illum } = mtlDissolveAndIllum(rep?.blend)
      pushMtlOnce({
        name: mname,
        d,
        illum,
        mapKd: comp.pngFileName,
      })
      objMeshes.push({
        objectName: `block_${col}_${row}_${zSlice}_ov_${mergeId}`,
        materialName: mname,
        positions: mergedAttrs.positions,
        uvs: mergedAttrs.uvs,
        colors: mergedAttrs.colors,
      })
    }
  }

  const objHeader = [
    '# wiki-multi-structure-render',
    '# mode=block; coplanar overlaps baked to merged_*.png (MC quadOrder)',
    `# voxels_non_air=${stats.nonAirVoxelCount} skipped_unmapped_voxels=${stats.skippedUnmappedCount}`,
  ]

  const objBody = serializeObjMeshes({
    headerLines: objHeader,
    mtllibName: MTL_NAME,
    meshes: objMeshes,
  })

  const zip = new JSZip()
  zip.file(OBJ_NAME, objBody)
  zip.file(MTL_NAME, serializeMtl(mtlEntries))

  for (const f of mergedPngFiles) {
    zip.file(f.path, f.blob)
  }

  const paletteIndices = Array.from({ length: def.materialPalette.length }, (_, i) => i)
  for (const bidx of [...blobIndices].sort((a, b) => a - b)) {
    const rep = representativePaletteEntryForBlob(def, paletteIndices, bidx)
    if (!rep) continue
    const raw = blobs[bidx] as string
    const png = await textureBlobToFirstFramePngBlob(raw, rep)
    zip.file(textureZipPath(bidx), png)
  }

  return await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' })
}

async function buildStructureBundleZipConnected(
  def: StructureDefinition,
  normalizedDocument: unknown,
  options?: StructureBundleExportOptions,
): Promise<Blob> {
  const blobs = extractTextureBlobs(normalizedDocument)
  const maxSide = options?.atlasMaxSide ?? DEFAULT_ATLAS_MAX_SIDE

  const { labels, componentCount } = labelVoxelComponents(def, options?.layerPreview ?? 'all')
  const { stats } = collectStructureGeometryPiecesPure(def, {
    ...options,
    cullOccludedQuads: false,
  })

  const objMeshes: ObjExportMesh[] = []
  const mtlEntries: MtlSerializedEntry[] = []
  const atlasZipFiles: Array<{ path: string; blob: Blob }> = []
  let texSerial = 0

  for (let cid = 0; cid < componentCount; cid++) {
    const { pieces } = collectStructureGeometryPiecesPure(def, {
      ...options,
      componentGather: { labels, componentId: cid },
    })
    if (pieces.length === 0) continue

    const matOrder = [...new Set(pieces.map((q) => q.materialIndex))].sort((a, b) => a - b)

    const usedBlob = new Set<number>()
    for (const p of pieces) {
      const e = def.materialPalette[p.materialIndex]
      const bi = e?.textureBlobIndex
      if (typeof bi === 'number' && Number.isFinite(bi)) usedBlob.add(Math.floor(bi))
    }

    const sortedBlobs = [...usedBlob].sort((a, b) => a - b)
    const dims: Array<{ blobIndex: number; width: number; height: number }> = []
    for (const bi of sortedBlobs) {
      const raw = blobs[bi]
      const rep = representativePaletteEntryForBlob(def, matOrder, bi)
      if (!rep || typeof raw !== 'string') continue
      const { width, height } = await measureTextureBlobFirstFrame(raw, rep)
      dims.push({ blobIndex: bi, width, height })
    }

    if (dims.length === 0) continue

    const { atlasWidth, atlasHeight, placements } = packTextureGrid(dims, 2, maxSide)

    const blobToRect = buildBlobIndexToUvRect(placements, atlasWidth, atlasHeight)

    const remapped: BakedQuadGeometryPiece[] = pieces.map((p) => {
      const e = def.materialPalette[p.materialIndex]
      const bi = typeof e?.textureBlobIndex === 'number' ? Math.floor(e.textureBlobIndex) : 0
      const newUvs = remapUvsToAtlasRect(p.uvs, bi, blobToRect)
      return { ...p, uvs: newUvs }
    })

    const merged = mergeBakedQuadPiecesAttributes(remapped)
    const texName = `textures/component_${texSerial}.png`
    texSerial++

    const matName = sanitizeNewmtlName(`component_${cid}`)
    mtlEntries.push({
      name: matName,
      d: 1,
      illum: 1,
      mapKd: texName,
    })

    objMeshes.push({
      objectName: `component_${cid}`,
      materialName: matName,
      positions: merged.positions,
      uvs: merged.uvs,
      colors: merged.colors,
    })

    const pngBlob = await rasterizeAtlasToPngBlob({
      atlasWidth,
      atlasHeight,
      placements,
      blobs,
      representativeEntry: (bidx) => representativePaletteEntryForBlob(def, matOrder, bidx),
    })
    atlasZipFiles.push({ path: texName, blob: pngBlob })
  }

  const objHeader = [
    '# wiki-multi-structure-render',
    '# mode=connected components; interior faces culled within component',
    `# voxels_non_air=${stats.nonAirVoxelCount} skipped_unmapped_voxels=${stats.skippedUnmappedCount}`,
  ]

  const objBody = serializeObjMeshes({
    headerLines: objHeader,
    mtllibName: MTL_NAME,
    meshes: objMeshes,
  })

  const zip = new JSZip()
  zip.file(OBJ_NAME, objBody)
  zip.file(MTL_NAME, serializeMtl(mtlEntries))

  for (const f of atlasZipFiles) {
    zip.file(f.path, f.blob)
  }

  return await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' })
}

function extractTextureBlobs(normalizedDocument: unknown): string[] {
  if (
    normalizedDocument !== null &&
    typeof normalizedDocument === 'object' &&
    Array.isArray((normalizedDocument as { textureBlobs?: unknown }).textureBlobs)
  ) {
    return ((normalizedDocument as { textureBlobs: unknown[] }).textureBlobs as unknown[]).filter(
      (x) => typeof x === 'string',
    ) as string[]
  }
  return []
}

function representativePaletteEntryForBlob(
  def: StructureDefinition,
  sortedMatIdx: number[],
  blobIndex: number,
): MaterialPaletteEntry | undefined {
  let fallback: MaterialPaletteEntry | undefined
  for (const mi of sortedMatIdx) {
    const e = def.materialPalette[mi]
    if (!e || typeof e.textureBlobIndex !== 'number' || Math.floor(e.textureBlobIndex) !== blobIndex)
      continue
    if (e.kind === 'animated') return e
    fallback = e
  }
  return fallback
}
