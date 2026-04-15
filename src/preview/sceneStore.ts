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
import { resolveRenderBundle } from '@/render/data/bundleResolve'
import {
  buildBlockMesh,
  formatUndefinedBlockDetailsForStatus,
} from '@/render/mesh/blockMesh'
import type { StructureDefinition } from '@/render/schema/types'
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
  registerScene(scene: THREE.Scene): void
  loadStructureAndResources(): Promise<void>
  rebuildContentMesh(): Promise<void>
  detachAndDisposeMesh(): void
  disposeCachesAndLibrary(): void
  contentGroupRef: ShallowRef<THREE.Group | null>
}

export const PreviewSceneContextKey: InjectionKey<PreviewSceneStore> = Symbol('PreviewSceneContext')

function formatError(err: unknown): string {
  return formatUnknownError(err)
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
  /** World 多帧时与 materialRegistryFromDocument / buildBlockMesh 一致 */
  const materialKeyPrefixRef = ref<string | undefined>(undefined)
  const sceneRef = shallowRef<THREE.Scene | null>(null)
  const contentGroupRef = shallowRef<THREE.Group | null>(null)

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

  async function loadStructureAndResources(): Promise<void> {
    loadStatus.value = 'loading'
    statusBarTone.value = 'loading'
    statusMessage.value = config.loadingMessage
    try {
      const resolved = resolveRenderBundle(config.renderBundle)
      structureDefinition.value = resolved.definition
      materialKeyPrefixRef.value = resolved.materialKeyPrefix
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
      console.error('[WikiMultiStructureRender]', e)
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
        statusMessage.value = config.okMessage(def.id) + ` · 非空气体素 ${stats.nonAirVoxelCount}` + undefinedAppend
      } else if (stats.nonAirVoxelCount === 0) {
        statusBarTone.value = 'ok'
        statusMessage.value =
          '无可视方块：当前分层下无体素或结构全为空气（可调整分层预览或检查 blockPalette）'
      } else {
        statusBarTone.value = 'warn'
        statusMessage.value =
          `无可见几何：${stats.nonAirVoxelCount} 个非空气体素无有效 BakedQuads（检查 blockPalette.geometry 或 materialPalette 预取）` +
          undefinedAppend
      }
    } catch (e) {
      statusBarTone.value = 'error'
      statusMessage.value = `网格构建失败: ${formatError(e)}`
      console.error('[WikiMultiStructureRender] buildBlockMesh', e)
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
    blockIconCache.value?.dispose()
    blockIconCache.value = null
    materialLibrary.value?.dispose()
    materialLibrary.value = null
    structureDefinition.value = null
    materialKeyPrefixRef.value = undefined
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
    registerScene,
    loadStructureAndResources,
    rebuildContentMesh,
    detachAndDisposeMesh,
    disposeCachesAndLibrary,
    contentGroupRef,
  }
}
