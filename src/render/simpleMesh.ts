import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import type { FaceName, SimpleDefinition } from './types'
import { buildVoxelGrid } from './grid'
import { layersForFace, listFaceNames } from './faceResolve'
import { TEXTURE_URL_BY_ID } from './textureRegistry'

const AIR = 'air'

const FACE_NORMAL: Record<FaceName, THREE.Vector3> = {
  '+x': new THREE.Vector3(1, 0, 0),
  '-x': new THREE.Vector3(-1, 0, 0),
  '+y': new THREE.Vector3(0, 1, 0),
  '-y': new THREE.Vector3(0, -1, 0),
  '+z': new THREE.Vector3(0, 0, 1),
  '-z': new THREE.Vector3(0, 0, -1),
}

/** 邻居方向：当前格 → 邻居格（用于判断外露面） */
const NEIGHBOR_D: Record<FaceName, [number, number, number]> = {
  '+x': [1, 0, 0],
  '-x': [-1, 0, 0],
  '+y': [0, 1, 0],
  '-y': [0, -1, 0],
  '+z': [0, 0, 1],
  '-z': [0, 0, -1],
}

function parseTint(hex?: string): THREE.Color {
  if (!hex) return new THREE.Color(0xffffff)
  return new THREE.Color(hex.startsWith('#') ? hex : `#${hex}`)
}

export interface SimpleMeshResult {
  group: THREE.Group
  dispose: () => void
}

/**
 * Simple 模式：体素栅格 → 外露面 Quad → 按材质合并（多层叠加用微小偏移避免 z-fighting）
 */
export async function buildSimpleMesh(def: SimpleDefinition): Promise<SimpleMeshResult> {
  const grid = buildVoxelGrid(def)
  const { sizeX, sizeY, sizeZ } = grid
  const loader = new THREE.TextureLoader()
  const textureCache = new Map<string, THREE.Texture>()

  async function loadTexture(id: string): Promise<THREE.Texture> {
    const hit = textureCache.get(id)
    if (hit) return hit
    const url = TEXTURE_URL_BY_ID[id]
    if (!url) throw new Error(`未知纹理 id: ${id}`)
    const tex = await new Promise<THREE.Texture>((resolve, reject) => {
      loader.load(url, resolve, undefined, reject)
    })
    tex.colorSpace = THREE.SRGBColorSpace
    tex.magFilter = THREE.NearestFilter
    tex.minFilter = THREE.NearestFilter
    textureCache.set(id, tex)
    return tex
 }

  type BatchKey = string
  const batches = new Map<BatchKey, THREE.BufferGeometry[]>()

  const faces = listFaceNames()

  for (let y = 0; y < sizeY; y++) {
    for (let z = 0; z < sizeZ; z++) {
      for (let x = 0; x < sizeX; x++) {
        const id = grid.get(x, y, z)
        if (id === AIR) continue

        const block = def.blocks[id]
        if (!block) continue

        for (const face of faces) {
          const [dx, dy, dz] = NEIGHBOR_D[face]
          const nx = x + dx
          const ny = y + dy
          const nz = z + dz
          const neighbor = grid.get(nx, ny, nz)
          if (neighbor !== AIR) continue

          const layerDefs = layersForFace(block, face)
          if (!layerDefs.length) continue

          const n = FACE_NORMAL[face]
          layerDefs.forEach((layer, layerIdx) => {
            const texId = layer.texture
            const tint = parseTint(layer.tint)
            const key = `${texId}|${tint.getHexString()}|${layerIdx}` as BatchKey
            const geom = quadGeometryForFace(
              face,
              x,
              y,
              z,
              sizeX,
              sizeY,
              sizeZ,
              n,
              layerIdx,
            )
            const arr = batches.get(key) ?? []
            arr.push(geom)
            batches.set(key, arr)
          })
        }
      }
    }
  }

  const group = new THREE.Group()
  const materials: THREE.MeshStandardMaterial[] = []
  const meshes: THREE.Mesh[] = []

  for (const [key, geoms] of batches) {
    if (!geoms.length) continue
    const [texId, tintHex] = key.split('|')
    const merged = mergeGeometries(geoms, false)
    if (!merged) continue
    const tex = await loadTexture(texId)
    const tint = new THREE.Color(`#${tintHex}`)
    const mat = new THREE.MeshStandardMaterial({
      map: tex,
      color: tint,
      roughness: 0.85,
      metalness: 0.05,
    })
    materials.push(mat)
    const mesh = new THREE.Mesh(merged, mat)
    group.add(mesh)
    meshes.push(mesh)
  }

  const dispose = () => {
    for (const m of meshes) {
      m.geometry.dispose()
    }
    for (const m of materials) {
      m.dispose()
    }
    for (const t of textureCache.values()) {
      t.dispose()
    }
  }

  return { group, dispose }
}

/**
 * 在网格坐标 (x,y,z) 的立方体单元上生成外法线为 n 的一个 quad（单位立方体角 [x,y,z]→[x+1,y+1,z+1]）
 */
function quadGeometryForFace(
  face: FaceName,
  x: number,
  y: number,
  z: number,
  sx: number,
  sy: number,
  sz: number,
  normal: THREE.Vector3,
  layerIdx: number,
): THREE.BufferGeometry {
  const ox = 0.002 * layerIdx
  const push = normal.clone().multiplyScalar(ox)

  const minX = x - sx / 2
  const maxX = x + 1 - sx / 2
  const minY = y - sy / 2
  const maxY = y + 1 - sy / 2
  const minZ = z - sz / 2
  const maxZ = z + 1 - sz / 2

  const p = (v: THREE.Vector3) => v.add(push)

  const geo = new THREE.BufferGeometry()
  let a: THREE.Vector3
  let b: THREE.Vector3
  let c: THREE.Vector3
  let d: THREE.Vector3

  switch (face) {
    case '+x':
      a = p(new THREE.Vector3(maxX, minY, minZ))
      b = p(new THREE.Vector3(maxX, maxY, minZ))
      c = p(new THREE.Vector3(maxX, maxY, maxZ))
      d = p(new THREE.Vector3(maxX, minY, maxZ))
      break
    case '-x':
      a = p(new THREE.Vector3(minX, minY, maxZ))
      b = p(new THREE.Vector3(minX, maxY, maxZ))
      c = p(new THREE.Vector3(minX, maxY, minZ))
      d = p(new THREE.Vector3(minX, minY, minZ))
      break
    case '+y':
      a = p(new THREE.Vector3(minX, maxY, minZ))
      b = p(new THREE.Vector3(maxX, maxY, minZ))
      c = p(new THREE.Vector3(maxX, maxY, maxZ))
      d = p(new THREE.Vector3(minX, maxY, maxZ))
      break
    case '-y':
      a = p(new THREE.Vector3(minX, minY, maxZ))
      b = p(new THREE.Vector3(maxX, minY, maxZ))
      c = p(new THREE.Vector3(maxX, minY, minZ))
      d = p(new THREE.Vector3(minX, minY, minZ))
      break
    case '+z':
      a = p(new THREE.Vector3(minX, minY, maxZ))
      b = p(new THREE.Vector3(minX, maxY, maxZ))
      c = p(new THREE.Vector3(maxX, maxY, maxZ))
      d = p(new THREE.Vector3(maxX, minY, maxZ))
      break
    case '-z':
      a = p(new THREE.Vector3(maxX, minY, minZ))
      b = p(new THREE.Vector3(maxX, maxY, minZ))
      c = p(new THREE.Vector3(minX, maxY, minZ))
      d = p(new THREE.Vector3(minX, minY, minZ))
      break
    default:
      throw new Error(`unknown face ${face}`)
  }

  const nx = normal.x
  const ny = normal.y
  const nz = normal.z

  const positions = new Float32Array([
    a.x, a.y, a.z,
    b.x, b.y, b.z,
    c.x, c.y, c.z,
    d.x, d.y, d.z,
  ])
  const normals = new Float32Array([
    nx, ny, nz,
    nx, ny, nz,
    nx, ny, nz,
    nx, ny, nz,
  ])
  const uvs = new Float32Array([0, 1, 0, 0, 1, 0, 1, 1])
  const index = new Uint16Array([0, 1, 2, 0, 2, 3])

  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
  geo.setIndex(new THREE.BufferAttribute(index, 1))

  return geo
}
