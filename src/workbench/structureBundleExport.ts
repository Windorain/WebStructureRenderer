/**
 * 工作台：全量 OBJ + MTL + textures/（ZIP），按体素×材质合并几何；动画贴图导出首帧。
 */

import JSZip from 'jszip'
import * as THREE from 'three'
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter.js'

import {
  frameCountFromImageSize,
  resolveAnimationTimeline,
  type ParsedMcmeta,
} from '@/render/assets/textureStripAnimation'
import { isWorldDocument } from '@/render/data/bundleResolve'
import { getDefaultFrameIndex } from '@/render/data/worldPlayback'
import type { BuildBlockMeshOptions } from '@/render/mesh/blockMesh'
import {
  collectStructureGeometryPiecesPure,
  mergeBakedQuadPiecesAttributes,
  type BakedQuadGeometryPiece,
} from '@/render/mesh/structureGeometryCore'
import type { MaterialBlendMode, MaterialPaletteEntry, StructureDefinition } from '@/render/schema/types'

const OBJ_NAME = 'structure.obj'
const MTL_NAME = 'structure.mtl'

export interface StructureBundleExportOptions extends BuildBlockMeshOptions {
  /** World 文档时覆盖默认帧 */
  worldFrameIndex?: number
}

function base64PngToDataUrl(b64: string): string {
  const t = b64.trim()
  if (t.startsWith('data:')) return t
  return `data:image/png;base64,${t}`
}

function paletteAnimationToParsed(entry: MaterialPaletteEntry): ParsedMcmeta {
  const a = entry.animation
  if (!a) return {}
  const seq = Array.isArray(a.frameSequence)
    ? a.frameSequence.map((f) => ({
        index: typeof f.index === 'number' ? f.index : 0,
        timeTicks:
          typeof f.timeTicks === 'number' && f.timeTicks > 0 ? Math.floor(f.timeTicks) : undefined,
      }))
    : []
  return {
    animation: {
      defaultFrametimeTicks:
        typeof a.defaultFrametimeTicks === 'number' && a.defaultFrametimeTicks > 0
          ? Math.floor(a.defaultFrametimeTicks)
          : 1,
      frameSequence: seq,
      interpolate: a.interpolate === true,
    },
  }
}

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('纹理图加载失败'))
    img.src = src
  })
}

async function textureBlobToFirstFramePngBlob(
  rawBlob: string,
  entry: MaterialPaletteEntry,
): Promise<Blob> {
  const dataUrl = base64PngToDataUrl(rawBlob)
  const img = await loadImageElement(dataUrl)
  const nw = img.naturalWidth
  const nh = img.naturalHeight
  if (nw <= 0 || nh <= 0) throw new Error('纹理图尺寸无效')

  let sy = 0
  let sh = nh
  if (entry.kind === 'animated') {
    const frameCount = frameCountFromImageSize(nw, nh)
    if (frameCount > 1) {
      const fh = nw
      const parsed = paletteAnimationToParsed(entry)
      const timeline = resolveAnimationTimeline(parsed, frameCount)
      const fi = Math.max(0, Math.min(frameCount - 1, timeline.frames[0]?.index ?? 0))
      sy = fi * fh
      sh = fh
    }
  }

  const canvas = document.createElement('canvas')
  canvas.width = nw
  canvas.height = sh
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 不可用')
  ctx.drawImage(img, 0, sy, nw, sh, 0, 0, nw, sh)
  return await new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('PNG 编码失败'))), 'image/png')
  })
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

function voxelMaterialBucketKey(col: number, row: number, zSlice: number, materialIndex: number): string {
  return `${col},${row},${zSlice},${materialIndex}`
}

function parseBucketKey(key: string): [number, number, number, number] {
  const p = key.split(',').map((x) => Number(x))
  return [p[0]!, p[1]!, p[2]!, p[3]!]
}

function mtlDissolveAndIllum(blend: MaterialBlendMode | undefined): { d: string; illum: string } {
  if (blend === 'translucent') return { d: '0.92', illum: '4' }
  return { d: '1', illum: '1' }
}

/**
 * 生成含 `structure.obj`、`structure.mtl`、`textures/blob_*.png` 的 ZIP（解压即可供 Blender 等使用）。
 */
function bufferGeometryFromMergedAttributes(
  positions: Float32Array,
  uvs: Float32Array,
  colors: Float32Array,
): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  g.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
  g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  g.computeVertexNormals()
  return g
}

export async function buildStructureBundleZip(
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

  const blobs =
    normalizedDocument !== null &&
    typeof normalizedDocument === 'object' &&
    Array.isArray((normalizedDocument as { textureBlobs?: unknown }).textureBlobs)
      ? ((normalizedDocument as { textureBlobs: unknown[] }).textureBlobs as unknown[]).filter(
          (x) => typeof x === 'string',
        )
      : []

  const usedMat = new Set<number>()
  for (const p of pieces) usedMat.add(p.materialIndex)

  const buckets = new Map<string, BakedQuadGeometryPiece[]>()
  for (const p of pieces) {
    const k = voxelMaterialBucketKey(p.col, p.row, p.zSlice, p.materialIndex)
    let arr = buckets.get(k)
    if (!arr) {
      arr = []
      buckets.set(k, arr)
    }
    arr.push(p)
  }

  const sortedKeys = [...buckets.keys()].sort((a, b) => {
    const [ca, ra, za, ma] = parseBucketKey(a)
    const [cb, rb, zb, mb] = parseBucketKey(b)
    if (za !== zb) return za - zb
    if (ra !== rb) return ra - rb
    if (ca !== cb) return ca - cb
    return ma - mb
  })

  const group = new THREE.Group()
  const disposable: Array<{ geometry: THREE.BufferGeometry; material: THREE.Material }> = []

  for (const key of sortedKeys) {
    const units = buckets.get(key)!
    units.sort((a, c) => a.quadOrder - c.quadOrder)
    const mergedAttrs = mergeBakedQuadPiecesAttributes(units)
    const merged = bufferGeometryFromMergedAttributes(
      mergedAttrs.positions,
      mergedAttrs.uvs,
      mergedAttrs.colors,
    )

    const [col, row, zSlice, mi] = parseBucketKey(key)
    const mtlName = sanitizeNewmtlName(paletteMaterialId(normalizedDocument, frameIdx, mi))
    const mat = new THREE.MeshBasicMaterial({ name: mtlName })
    const mesh = new THREE.Mesh(merged, mat)
    mesh.name = `block_${col}_${row}_${zSlice}_mat${mi}`
    group.add(mesh)
    disposable.push({ geometry: merged, material: mat })
  }

  const objHeader = [
    '# wiki-multi-structure-render',
    '# full mesh: no interior cull; merged per voxel × material',
    `# voxels_non_air=${stats.nonAirVoxelCount} skipped_unmapped_voxels=${stats.skippedUnmappedCount}`,
    `mtllib ${MTL_NAME}`,
    '',
  ].join('\n')

  const exporter = new OBJExporter()
  const objBody = exporter.parse(group)

  for (const d of disposable) {
    d.geometry.dispose()
    d.material.dispose()
  }

  const sortedMatIdx = [...usedMat].sort((a, b) => a - b)
  const mtlLines: string[] = ['# wiki-multi-structure-render', '']
  const blobIndices = new Set<number>()

  for (const mi of sortedMatIdx) {
    const entry = def.materialPalette[mi]
    if (!entry) continue
    const mname = sanitizeNewmtlName(paletteMaterialId(normalizedDocument, frameIdx, mi))
    const { d, illum } = mtlDissolveAndIllum(entry.blend)
    mtlLines.push(`newmtl ${mname}`)
    mtlLines.push('Ka 1 1 1')
    mtlLines.push('Kd 1 1 1')
    mtlLines.push('Ks 0 0 0')
    mtlLines.push(`d ${d}`)
    mtlLines.push(`illum ${illum}`)
    const bidx = entry.textureBlobIndex
    if (typeof bidx === 'number' && Number.isFinite(bidx) && blobs[Math.floor(bidx)]) {
      const bi = Math.floor(bidx)
      mtlLines.push(`map_Kd ${textureZipPath(bi)}`)
      blobIndices.add(bi)
    }
    mtlLines.push('')
  }

  function representativePaletteEntryForBlob(blobIndex: number): MaterialPaletteEntry | undefined {
    let fallback: MaterialPaletteEntry | undefined
    for (const mi of sortedMatIdx) {
      const e = def.materialPalette[mi]
      if (!e || e.textureBlobIndex !== blobIndex) continue
      if (e.kind === 'animated') return e
      fallback = e
    }
    return fallback
  }

  const zip = new JSZip()
  zip.file(OBJ_NAME, `${objHeader}${objBody}`)
  zip.file(MTL_NAME, `${mtlLines.join('\n')}\n`)

  for (const bidx of [...blobIndices].sort((a, b) => a - b)) {
    const rep = representativePaletteEntryForBlob(bidx)
    if (!rep) continue
    const raw = blobs[bidx] as string
    const png = await textureBlobToFirstFramePngBlob(raw, rep)
    zip.file(textureZipPath(bidx), png)
  }

  return await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' })
}
