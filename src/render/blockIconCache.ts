/**
 * 方块 id → 物品栏精灵（Canvas / data URL）集中缓存；单 WebGLRenderer 串行烘焙。
 */

import * as THREE from 'three'

import type { SimpleMaterialLibrary } from './materials/simpleMaterialLibrary'
import { buildSingleBlockPreviewGroup } from './blockSlotBaker'
import type { BlockEntry } from './types'

export type BlockIconCacheStatus = 'idle' | 'pending' | 'ready' | 'error'

export interface BlockIconCachedEntry {
  status: BlockIconCacheStatus
  /** ready 时可用：离屏 canvas 或占位 */
  canvas?: HTMLCanvasElement
  error?: Error
}

export interface BlockIconCacheOptions {
  /** 纹理边长（正方形） */
  sizePx?: number
  /** 正交半宽/半高；越小方块在图内越大 */
  orthoHalf?: number
  /** 背景色（与侧栏协调）；alpha 0 可透 */
  clearColor?: number
  clearAlpha?: number
}

/** 变更 ortho/size 等布局时递增，供 `setRevisionKey` 拼接以重烘 */
export const BLOCK_ICON_LAYOUT_REVISION = '1'

type ResolvedIconOpts = Required<BlockIconCacheOptions>

const defaultOpts: ResolvedIconOpts = {
  sizePx: 64,
  orthoHalf: 1.22,
  /** 与 clearAlpha=0 搭配；清屏后仅几何/贴图覆盖处不透明，其余为透明「虚空」 */
  clearColor: 0x000000,
  clearAlpha: 0,
}

/** 供 `setRevisionKey` 拼接：烘焙参数变化时需重烘 */
export function blockIconBakeLayoutKey(options?: BlockIconCacheOptions): string {
  const o = { ...defaultOpts, ...options } as ResolvedIconOpts
  return `${o.sizePx}:${o.orthoHalf}:${o.clearColor}:${o.clearAlpha}`
}

/**
 * 失效键由调用方提供：结构 id + blocks 摘要变化时整表清空。
 */
export class BlockIconCache {
  private readonly library: SimpleMaterialLibrary

  private readonly blocks: Record<string, BlockEntry>

  private readonly opts: Required<BlockIconCacheOptions>

  private renderer: THREE.WebGLRenderer | null = null

  private readonly map = new Map<string, BlockIconCachedEntry>()

  private readonly pendingQueue: string[] = []

  private drainRunning = false

  private revision = ''

  private disposed = false

  private readonly listeners = new Set<() => void>()

  constructor(
    library: SimpleMaterialLibrary,
    blocks: Record<string, BlockEntry>,
    options?: BlockIconCacheOptions,
  ) {
    this.library = library
    this.blocks = blocks
    this.opts = { ...defaultOpts, ...options } as ResolvedIconOpts
  }

  /** 当结构或方块表变更时调用，会 dispose 旧图并清空队列 */
  setRevisionKey(key: string): void {
    if (this.revision === key) return
    this.revision = key
    this.clearEntries()
  }

  get(blockId: string): BlockIconCachedEntry {
    return this.map.get(blockId) ?? { status: 'idle' }
  }

  /** 任一 id 烘焙完成或失败时触发，供 Vue 刷新 */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notify(): void {
    for (const fn of this.listeners) {
      try {
        fn()
      } catch {
        /* ignore */
      }
    }
  }

  /** 去重后请求烘焙；同一 id 只排队一次 */
  ensure(blockIds: string[]): void {
    if (this.disposed) return
    const seen = new Set<string>()
    for (const id of blockIds) {
      if (seen.has(id)) continue
      seen.add(id)
      const row = this.map.get(id)
      if (row?.status === 'ready' || row?.status === 'pending') continue
      this.map.set(id, { status: 'pending' })
      this.pendingQueue.push(id)
    }
    void this.drainQueue()
  }

  private async drainQueue(): Promise<void> {
    if (this.drainRunning || this.disposed) return
    this.drainRunning = true
    try {
      while (this.pendingQueue.length > 0 && !this.disposed) {
        const id = this.pendingQueue.shift()!
        const current = this.map.get(id)
        if (!current || current.status !== 'pending') continue
        await this.bakeOne(id)
      }
    } finally {
      this.drainRunning = false
    }
  }

  private ensureRenderer(): THREE.WebGLRenderer {
    if (this.renderer) return this.renderer
    const r = new THREE.WebGLRenderer({
      alpha: this.opts.clearAlpha < 1,
      antialias: false,
      preserveDrawingBuffer: true,
    })
    r.setPixelRatio(1)
    r.outputColorSpace = THREE.SRGBColorSpace
    const s = this.opts.sizePx
    r.setSize(s, s, false)
    r.setClearColor(this.opts.clearColor, this.opts.clearAlpha)
    this.renderer = r
    return r
  }

  private async bakeOne(blockId: string): Promise<void> {
    if (this.disposed) return
    const block = this.blocks[blockId]
    if (!block) {
      this.map.set(blockId, {
        status: 'error',
        error: new Error(`方块未注册: ${blockId}`),
      })
      this.notify()
      return
    }

    let group: THREE.Group | null = null
    let disposeMesh: (() => void) | null = null

    try {
      const built = await buildSingleBlockPreviewGroup(block, this.library)
      group = built.group
      disposeMesh = built.dispose

      const renderer = this.ensureRenderer()
      const s = this.opts.sizePx
      const scene = new THREE.Scene()
      scene.add(group)

      // 从世界 **-Z**（北）侧观察：`-z` 面法线朝外为 -Z，与相机视线（+Z）相对，控制器贴图可见
      const ambient = new THREE.AmbientLight(0xffffff, 0.72)
      const dirKey = new THREE.DirectionalLight(0xffffff, 0.88)
      dirKey.position.set(0, 0, -6)
      const dirFill = new THREE.DirectionalLight(0xffffff, 0.32)
      dirFill.position.set(5, 8, 4)
      scene.add(ambient, dirKey, dirFill)

      // 正交半宽/半高 orthoHalf：越小方块在图内越大（见 BlockIconCacheOptions）
      const half = this.opts.orthoHalf
      const cam = new THREE.OrthographicCamera(-half, half, half, -half, 0.1, 80)
      // 正交相机沿 +Z 看向原点；「拉近」只调 orthoHalf，不依赖 z
      cam.position.set(0, 0, -4.2)
      cam.lookAt(0, 0, 0)
      cam.updateProjectionMatrix()

      renderer.setClearColor(this.opts.clearColor, this.opts.clearAlpha)
      renderer.setSize(s, s, false)
      this.library.tick(16)
      renderer.render(scene, cam)

      const src = renderer.domElement
      const canvas = document.createElement('canvas')
      canvas.width = s
      canvas.height = s
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('2D context unavailable')
      ctx.drawImage(src, 0, 0)

      this.map.set(blockId, { status: 'ready', canvas })
      this.notify()
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e))
      this.map.set(blockId, { status: 'error', error: err })
      this.notify()
    } finally {
      disposeMesh?.()
    }
  }

  private clearEntries(): void {
    for (const v of this.map.values()) {
      if (v.canvas) {
        v.canvas.width = 0
        v.canvas.height = 0
      }
    }
    this.map.clear()
    this.pendingQueue.length = 0
  }

  dispose(): void {
    if (this.disposed) return
    this.disposed = true
    this.clearEntries()
    this.renderer?.dispose()
    this.renderer?.forceContextLoss?.()
    this.renderer = null
    this.listeners.clear()
  }
}
