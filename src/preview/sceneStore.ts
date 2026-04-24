/**
 * 预览场景：结构、分层、网格、图标缓存与统计的编排。
 */

import type { InjectionKey } from 'vue'
import {
  computed,
  ref,
  shallowRef,
  watch,
  type ComputedRef,
  type Ref,
  type ShallowRef,
} from 'vue'
import * as THREE from 'three'

import {
  BlockIconCache,
  BLOCK_ICON_LAYOUT_REVISION,
  blockIconBakeLayoutKey,
} from '@/render/interaction/blockIconCache'
import { buildBlockStatsEntries, type BlockStatRow } from '@/render/interaction/blockStats'
import { MC_ITEM_SLOT_BAKE_REVISION, summarizeBlocksForCache } from '@/render/interaction/blockSlotBaker'
import type { LayerPreviewMode } from '@/render/data/layerPreview'
import type { MaterialLibraryApi } from '@/render/materials/simpleMaterialLibrary'
import { isWorldDocument, resolveRenderBundle, type RenderBundleResolveResult } from '@/render/data/bundleResolve'
import { frameAt } from '@/render/data/worldPlayback'
import {
  buildBlockMesh,
  formatUndefinedBlockDetailsForStatus,
} from '@/render/mesh/blockMesh'
import type { StructureDefinition, World } from '@/render/schema/types'
import type { ProjectionMode } from '@/render/viewport/renderViewport'
import { formatUnknownError } from '@/util/formatUnknownError'

import type { PreviewConfig } from './previewConfig'

export type LoadStatus = 'loading' | 'ok' | 'error'

/** 状态条色调：空场景但本应有几何时为 warn */
export type StatusBarTone = 'loading' | 'ok' | 'warn' | 'error'

export interface PreviewSceneStore {
  showBlockStatsSidebar: boolean
  loadStatus: Ref<LoadStatus>
  statusBarTone: Ref<StatusBarTone>
  statusMessage: Ref<string>
  layerWorldY: Ref<number>
  meshBusy: Ref<boolean>
  projectionMode: Ref<ProjectionMode>
  structureDefinition: ShallowRef<StructureDefinition | null>
  materialLibrary: ShallowRef<MaterialLibraryApi | null>
  blockIconCache: ShallowRef<BlockIconCache | null>
  sizeRow: ComputedRef<number>
  layerPreviewMode: ComputedRef<LayerPreviewMode>
  blockStatsEntries: ComputedRef<BlockStatRow[]>
  projectionLabel: ComputedRef<string>
  layerPreviewLabel: ComputedRef<string>
  /** 与当帧 `StructureDefinition` 及拾取 `cellTooltipGrid` 配合；来自 World 或单文件根 */
  tooltipPalette: ShallowRef<string[]>
  registerScene(scene: THREE.Scene): void
  loadStructureAndResources(): Promise<void>
  rebuildContentMesh(): Promise<void>
  detachAndDisposeMesh(): void
  disposeCachesAndLibrary(): void
  contentGroupRef: ShallowRef<THREE.Group | null>
  /** World 且 `frames.length > 1` 时为真；用于多帧轮播 UI */
  hasWorldMultiFrame: ComputedRef<boolean>
  /** 当前 `World.frames` 下标（单结构文档时恒为 0） */
  worldFrameIndex: Ref<number>
  /** 多帧时间轴轮播中 */
  framesPlaybackIsPlaying: Ref<boolean>
  /** 仅 World 多帧：播放 / 暂停（按每帧 `durationMs`，缺省 1000ms；遇尾帧依 `playback.loop`） */
  toggleWorldFramesPlayback(): void
  /** World 文档的 `frames.length`；单结构文档为 0 */
  worldFrameCount: ComputedRef<number>
  /** 将当前体素/材质切换到指定 `World.frames` 下标（会重建网格与图标缓存） */
  setCurrentWorldFrame(index: number): Promise<void>
}

export const PreviewSceneContextKey: InjectionKey<PreviewSceneStore> = Symbol('PreviewSceneContext')

function formatError(err: unknown): string {
  return formatUnknownError(err)
}

const DEFAULT_WORLD_FRAME_DWELL_MS = 1000

function normalizeWorldFrameListIndex(w: World, raw: number): number {
  const n = w.frames.length
  if (n === 0) return 0
  let i = Math.floor(raw)
  if (w.playback?.loop) {
    return ((i % n) + n) % n
  }
  return Math.max(0, Math.min(n - 1, i))
}

export function createPreviewSceneStore(config: PreviewConfig): PreviewSceneStore {
  const loadStatus = ref<LoadStatus>('loading')
  const statusBarTone = ref<StatusBarTone>('loading')
  const statusMessage = ref(config.loadingMessage)
  const layerWorldY = ref(config.initialLayerWorldY)
  const meshBusy = ref(false)
  const projectionMode = ref<ProjectionMode>(config.initialProjectionMode)

  const structureDefinition = shallowRef<StructureDefinition | null>(null)
  const materialLibrary = shallowRef<MaterialLibraryApi | null>(null)
  const blockIconCache = shallowRef<BlockIconCache | null>(null)
  /** World 多帧时与 buildMaterialRegistryFromSceneDocument / buildBlockMesh 一致 */
  const materialKeyPrefixRef = ref<string | undefined>(undefined)
  const tooltipPalette = shallowRef<string[]>([])
  const sceneRef = shallowRef<THREE.Scene | null>(null)
  const contentGroupRef = shallowRef<THREE.Group | null>(null)

  const worldFrameIndex = ref(0)
  const framesPlaybackIsPlaying = ref(false)
  let worldPlaybackTimeoutId: ReturnType<typeof setTimeout> | null = null

  const worldFrameCount = computed(() => {
    const doc = config.renderBundle.document
    if (!isWorldDocument(doc)) {
      return 0
    }
    return doc.frames.length
  })

  const hasWorldMultiFrame = computed(() => worldFrameCount.value > 1)

  let disposeContent: (() => void) | null = null
  let meshBuildSeq = 0

  const sizeRow = computed(() => structureDefinition.value?.cellGrid[0]?.length ?? 0)

  const layerPreviewMode = computed<LayerPreviewMode>(() => {
    const y = layerWorldY.value
    if (y < 0) return 'all'
    return { worldY: y }
  })

  const blockStatsEntries = computed(() => {
    const def = structureDefinition.value
    if (!def) return []
    return buildBlockStatsEntries(def, layerPreviewMode.value)
  })

  const projectionLabel = computed(() =>
    projectionMode.value === 'perspective' ? '透视投影' : '正交投影',
  )

  const layerPreviewLabel = computed(() =>
    layerWorldY.value < 0 ? 'ALL' : `Y = ${layerWorldY.value}`,
  )

  watch(
    [blockStatsEntries, blockIconCache],
    () => {
      const cache = blockIconCache.value
      if (!cache) return
      cache.ensure(blockStatsEntries.value.map((r) => r.blockId))
    },
    { flush: 'post' },
  )

  function registerScene(scene: THREE.Scene): void {
    sceneRef.value = scene
  }

  function clearWorldPlaybackSchedule(): void {
    if (worldPlaybackTimeoutId !== null) {
      clearTimeout(worldPlaybackTimeoutId)
      worldPlaybackTimeoutId = null
    }
  }

  function dwellMsForCurrentWorldFrame(): number {
    const doc = config.renderBundle.document
    if (!isWorldDocument(doc) || doc.frames.length === 0) {
      return DEFAULT_WORLD_FRAME_DWELL_MS
    }
    const f = frameAt(doc, worldFrameIndex.value)
    const d = f?.durationMs
    if (typeof d === 'number' && Number.isFinite(d) && d > 0) {
      return d
    }
    return DEFAULT_WORLD_FRAME_DWELL_MS
  }

  function scheduleNextWorldFrameStep(): void {
    clearWorldPlaybackSchedule()
    if (!framesPlaybackIsPlaying.value || !hasWorldMultiFrame.value) {
      return
    }
    const doc = config.renderBundle.document
    if (!isWorldDocument(doc) || doc.frames.length < 2) {
      return
    }
    const n = doc.frames.length
    const loop = Boolean(doc.playback?.loop)
    const delay = dwellMsForCurrentWorldFrame()
    const fromIndex = worldFrameIndex.value
    worldPlaybackTimeoutId = setTimeout(() => {
      worldPlaybackTimeoutId = null
      if (!framesPlaybackIsPlaying.value) {
        return
      }
      let next = fromIndex + 1
      if (next >= n) {
        if (loop) {
          next = 0
        } else {
          framesPlaybackIsPlaying.value = false
          return
        }
      }
      void setCurrentWorldFrame(next)
        .then(() => {
          if (framesPlaybackIsPlaying.value) {
            scheduleNextWorldFrameStep()
          }
        })
        .catch(() => {
          framesPlaybackIsPlaying.value = false
        })
    }, delay)
  }

  function toggleWorldFramesPlayback(): void {
    if (!hasWorldMultiFrame.value) {
      return
    }
    if (framesPlaybackIsPlaying.value) {
      framesPlaybackIsPlaying.value = false
      clearWorldPlaybackSchedule()
      return
    }
    framesPlaybackIsPlaying.value = true
    scheduleNextWorldFrameStep()
  }

  async function setCurrentWorldFrame(rawNext: number): Promise<void> {
    const doc = config.renderBundle.document
    if (!isWorldDocument(doc) || doc.frames.length === 0) {
      return
    }
    const idx = normalizeWorldFrameListIndex(doc, rawNext)
    if (idx === worldFrameIndex.value && structureDefinition.value) {
      return
    }
    worldFrameIndex.value = idx
    const resolved: RenderBundleResolveResult = resolveRenderBundle(config.renderBundle, idx)
    structureDefinition.value = resolved.definition
    materialKeyPrefixRef.value = resolved.materialKeyPrefix
    tooltipPalette.value = resolved.tooltipPalette
    const lib = config.materialLibrary
    const iconCache = new BlockIconCache(
      lib,
      {
        ...config.blockIconCacheOptions,
        materialKeyPrefix: resolved.materialKeyPrefix,
      },
      resolved.definition,
    )
    iconCache.setRevisionKey(
      `${resolved.definition.id}:${summarizeBlocksForCache(resolved.definition)}:${MC_ITEM_SLOT_BAKE_REVISION}:${BLOCK_ICON_LAYOUT_REVISION}:${blockIconBakeLayoutKey({
        ...config.blockIconCacheOptions,
        materialKeyPrefix: resolved.materialKeyPrefix,
      })}`,
    )
    blockIconCache.value = iconCache
    await rebuildContentMesh()
  }

  async function loadStructureAndResources(): Promise<void> {
    clearWorldPlaybackSchedule()
    framesPlaybackIsPlaying.value = false
    loadStatus.value = 'loading'
    statusBarTone.value = 'loading'
    statusMessage.value = config.loadingMessage
    try {
      const initial =
        isWorldDocument(config.renderBundle.document) && config.initialWorldFrameIndex !== undefined
          ? config.initialWorldFrameIndex
          : undefined
      const resolved: RenderBundleResolveResult = resolveRenderBundle(config.renderBundle, initial)
      if (resolved.worldFrameIndex !== undefined) {
        worldFrameIndex.value = resolved.worldFrameIndex
      } else {
        worldFrameIndex.value = 0
      }
      structureDefinition.value = resolved.definition
      materialKeyPrefixRef.value = resolved.materialKeyPrefix
      tooltipPalette.value = resolved.tooltipPalette
      materialLibrary.value = config.materialLibrary
      const iconCache = new BlockIconCache(config.materialLibrary, {
        ...config.blockIconCacheOptions,
        materialKeyPrefix: resolved.materialKeyPrefix,
      }, resolved.definition)
      iconCache.setRevisionKey(
        `${resolved.definition.id}:${summarizeBlocksForCache(resolved.definition)}:${MC_ITEM_SLOT_BAKE_REVISION}:${BLOCK_ICON_LAYOUT_REVISION}:${blockIconBakeLayoutKey({
          ...config.blockIconCacheOptions,
          materialKeyPrefix: resolved.materialKeyPrefix,
        })}`,
      )
      blockIconCache.value = iconCache
      loadStatus.value = 'ok'
      statusBarTone.value = 'ok'
      statusMessage.value = '正在构建网格…'
    } catch (e) {
      loadStatus.value = 'error'
      statusBarTone.value = 'error'
      statusMessage.value = formatError(e)
      console.error('[StructureRenderer]', e)
    }
  }

  async function rebuildContentMesh(): Promise<void> {
    const def = structureDefinition.value
    const lib = materialLibrary.value
    const scene = sceneRef.value
    if (!def || !lib || !scene) return

    const seq = ++meshBuildSeq
    meshBusy.value = true
    try {
      const prev = contentGroupRef.value
      if (prev) {
        scene.remove(prev)
        disposeContent?.()
        contentGroupRef.value = null
        disposeContent = null
      }
      const result = await buildBlockMesh(def, lib, {
        layerPreview: layerPreviewMode.value,
        materialKeyPrefix: materialKeyPrefixRef.value,
      })
      if (seq !== meshBuildSeq) {
        result.dispose()
        return
      }
      contentGroupRef.value = result.group
      disposeContent = result.dispose
      scene.add(result.group)

      const { stats } = result
      const hasMesh = result.group.children.length > 0
      const undefinedAppend = formatUndefinedBlockDetailsForStatus(stats.undefinedBlockDetails)
      const hasUndefined = stats.undefinedBlockDetails.length > 0

      if (hasMesh) {
        statusBarTone.value = hasUndefined ? 'warn' : 'ok'
        statusMessage.value = `模型 ${def.id} · 非空气体素 ${stats.nonAirVoxelCount}` + undefinedAppend
      } else if (stats.nonAirVoxelCount === 0) {
        statusBarTone.value = 'ok'
        statusMessage.value = '非空气体素 0'
      } else {
        statusBarTone.value = 'warn'
        statusMessage.value = `无可见几何 · 非空气体素 ${stats.nonAirVoxelCount}` + undefinedAppend
      }
    } catch (e) {
      statusBarTone.value = 'error'
      statusMessage.value = `网格构建失败: ${formatError(e)}`
      console.error('[StructureRenderer] buildBlockMesh', e)
    } finally {
      if (seq === meshBuildSeq) meshBusy.value = false
    }
  }

  function detachAndDisposeMesh(): void {
    meshBuildSeq++
    const scene = sceneRef.value
    const g = contentGroupRef.value
    if (g && scene) scene.remove(g)
    disposeContent?.()
    contentGroupRef.value = null
    disposeContent = null
  }

  function disposeCachesAndLibrary(): void {
    clearWorldPlaybackSchedule()
    framesPlaybackIsPlaying.value = false
    blockIconCache.value?.dispose()
    blockIconCache.value = null
    materialLibrary.value?.dispose()
    materialLibrary.value = null
    structureDefinition.value = null
    materialKeyPrefixRef.value = undefined
    tooltipPalette.value = []
    worldFrameIndex.value = 0
    sceneRef.value = null
  }

  watch(layerWorldY, () => {
    if (!structureDefinition.value || !sceneRef.value) return
    void rebuildContentMesh()
  })

  return {
    showBlockStatsSidebar: config.features.blockStatsSidebar,
    loadStatus,
    statusBarTone,
    statusMessage,
    layerWorldY,
    meshBusy,
    projectionMode,
    structureDefinition,
    materialLibrary,
    blockIconCache,
    sizeRow,
    layerPreviewMode,
    blockStatsEntries,
    projectionLabel,
    layerPreviewLabel,
    tooltipPalette,
    registerScene,
    loadStructureAndResources,
    rebuildContentMesh,
    detachAndDisposeMesh,
    disposeCachesAndLibrary,
    contentGroupRef,
    hasWorldMultiFrame,
    worldFrameIndex,
    framesPlaybackIsPlaying,
    toggleWorldFramesPlayback,
    worldFrameCount,
    setCurrentWorldFrame,
  }
}
