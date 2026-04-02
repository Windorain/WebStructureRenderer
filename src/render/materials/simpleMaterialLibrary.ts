/**
 * 材质库：按 material_registry 加载 PNG + 可选 mcmeta，创建 MeshStandardMaterial，
 * 驱动 Minecraft 风格竖直帧条动画；与体素几何解耦。
 */

import * as THREE from 'three'

import { resolveLocatorToUrl, resolveMcmetaRawForLocator } from '../assets/resolveAssets'
import {
  frameCountFromImageSize,
  parseMcmetaJson,
  resolveAnimationTimeline,
  type ParsedMcmeta,
} from '../assets/mcmeta'
import { batchMaterialCacheKey, type BatchDescriptor } from '../mesh/batchDescriptor'
import type { LayerRole, MaterialRegistryData } from '../schema/types'

function createFaceMaterial(
  tex: THREE.Texture,
  tint: THREE.Color,
  layerRole: LayerRole,
): THREE.MeshStandardMaterial {
  if (layerRole === 'cutout' || layerRole === 'glass') {
    return new THREE.MeshStandardMaterial({
      map: tex,
      color: tint,
      transparent: true,
      alphaTest: 0.5,
      depthWrite: false,
      roughness: 0.85,
      metalness: 0.05,
    })
  }
  return new THREE.MeshStandardMaterial({
    map: tex,
    color: tint,
    roughness: 0.85,
    metalness: 0.05,
  })
}

function shouldAnimateStrip(parsed: ParsedMcmeta, frameCount: number): boolean {
  if (frameCount < 2) return false
  return parsed.animation !== undefined
}

function applyAnimatedStrip(
  tex: THREE.Texture,
  parsed: ParsedMcmeta,
  frameCount: number,
  registerTick: (fn: (dtMs: number) => void) => void,
): void {
  const { frames, durationMsPerFrame } = resolveAnimationTimeline(parsed, frameCount)
  if (frames.length === 0) return

  tex.repeat.set(1, 1 / frameCount)
  tex.offset.set(0, 0)

  let frameSeq = 0
  let accMs = 0

  const applyFrameAtIndex = (i: number) => {
    const f = frames[i % frames.length].index
    const clamped = Math.max(0, Math.min(frameCount - 1, f))
    // 与 `loadTexture` 中 `flipY=false` 一致：第 0 帧在 PNG 最上一格（见 mcmeta 注释），offset 自上而下递增
    tex.offset.y = clamped / frameCount
  }

  applyFrameAtIndex(0)

  registerTick((dtMs) => {
    accMs += dtMs
    const len = frames.length
    if (len === 0) return
    let dur = durationMsPerFrame[frameSeq % len]
    if (dur <= 0) dur = 1
    while (accMs >= dur) {
      accMs -= dur
      frameSeq = (frameSeq + 1) % len
      applyFrameAtIndex(frameSeq)
      dur = durationMsPerFrame[frameSeq % len]
      if (dur <= 0) dur = 1
    }
  })
}

export class SimpleMaterialLibrary {
  private readonly registry: MaterialRegistryData

  private readonly loader: THREE.TextureLoader

  private readonly textureByMaterialId = new Map<string, THREE.Texture>()

  private readonly textureLoadPromises = new Map<string, Promise<THREE.Texture>>()

  private readonly materialByBatchKey = new Map<string, THREE.MeshStandardMaterial>()

  private readonly tickFns: Array<(dtMs: number) => void> = []

  private disposed = false

  constructor(registry: MaterialRegistryData, loader?: THREE.TextureLoader) {
    this.registry = registry
    this.loader = loader ?? new THREE.TextureLoader()
  }

  /** 每帧调用（毫秒） */
  tick(deltaMs: number): void {
    if (this.disposed) return
    for (const fn of this.tickFns) {
      fn(deltaMs)
    }
  }

  private registerTick(fn: (dtMs: number) => void): void {
    this.tickFns.push(fn)
  }

  private async loadTexture(materialId: string): Promise<THREE.Texture> {
    const entry = this.registry.materials[materialId]
    if (!entry) throw new Error(`材质未注册: ${materialId}`)

    const cached = this.textureByMaterialId.get(materialId)
    if (cached) return cached

    const pending = this.textureLoadPromises.get(materialId)
    if (pending) return pending

    const promise = new Promise<THREE.Texture>((resolve, reject) => {
      const url = resolveLocatorToUrl(entry.locator)
      this.loader.load(
        url,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace
          /**
           * Three.js 默认 `flipY=true` 会在上传 GPU 时沿 Y 翻转 PNG，使采样与「浏览器图像坐标」对齐；
           * `blockFaceUv.ts` 的 U/V 与 MyCTMLib `QuadRender` 一致，假定 **PNG 顶行 = 纹理 v 增大方向的一端**
           *（与 Java 侧 sprite 一致）。若保持默认 flipY，整张贴图会与该 UV 约定相反，表现为 **上下颠倒**。
           * 在材质层统一 `flipY=false`，与 PNG 行顺序一致，不在 UV 里按面改 v。
           */
          tex.flipY = false
          tex.magFilter = THREE.NearestFilter
          tex.minFilter = THREE.NearestFilter
          tex.wrapS = THREE.ClampToEdgeWrapping
          tex.wrapT = THREE.ClampToEdgeWrapping

          const img = tex.image as HTMLImageElement
          const w = img.naturalWidth || img.width
          const h = img.naturalHeight || img.height

          let parsed: ParsedMcmeta
          const raw = resolveMcmetaRawForLocator(entry.locator)
          if (raw !== undefined) {
            parsed = parseMcmetaJson(raw)
          } else {
            parsed = {}
          }

          let nFrames = 1
          try {
            nFrames = frameCountFromImageSize(w, h)
          } catch {
            nFrames = 1
          }

          if (shouldAnimateStrip(parsed, nFrames)) {
            applyAnimatedStrip(tex, parsed, nFrames, (fn) => this.registerTick(fn))
          } else {
            tex.repeat.set(1, 1)
            tex.offset.set(0, 0)
          }

          this.textureByMaterialId.set(materialId, tex)
          resolve(tex)
        },
        undefined,
        reject,
      )
    })

    this.textureLoadPromises.set(materialId, promise)
    return promise
  }

  /**
   * 按批次描述符取材质（同 `batchMaterialCacheKey` 复用）。
   */
  async getMaterialForBatch(descriptor: BatchDescriptor): Promise<THREE.MeshStandardMaterial> {
    const key = batchMaterialCacheKey(descriptor)
    const hit = this.materialByBatchKey.get(key)
    if (hit) return hit

    const { materialId, tint, role } = descriptor
    await this.loadTexture(materialId)
    const tex = this.textureByMaterialId.get(materialId)
    if (!tex) throw new Error(`纹理加载失败: ${materialId}`)

    const mat = createFaceMaterial(tex, tint, role)
    this.materialByBatchKey.set(key, mat)
    return mat
  }

  dispose(): void {
    if (this.disposed) return
    this.disposed = true
    this.tickFns.length = 0

    for (const mat of this.materialByBatchKey.values()) {
      mat.dispose()
    }
    this.materialByBatchKey.clear()

    for (const tex of this.textureByMaterialId.values()) {
      tex.dispose()
    }
    this.textureByMaterialId.clear()
    this.textureLoadPromises.clear()
  }
}
