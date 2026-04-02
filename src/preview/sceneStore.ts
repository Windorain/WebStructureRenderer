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
import { buildBlockMesh } from '@/render/mesh/blockMesh'
import type { StructureDefinition } from '@/render/schema/types'
import type { ProjectionMode } from '@/render/viewport/renderViewport'
import { formatUnknownError } from '@/util/formatUnknownError'

import type { PreviewConfig } from './previewConfig'

export type LoadStatus = 'loading' | 'ok' | 'error'

export interface PreviewSceneStore {
  showBlockStatsSidebar: boolean
  loadStatus: Ref<LoadStatus>
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
  const statusMessage = ref(config.loadingMessage)
  const layerWorldY = ref(config.initialLayerWorldY)
  const meshBusy = ref(false)
  const projectionMode = ref<ProjectionMode>(config.initialProjectionMode)

  const structureDefinition = shallowRef<StructureDefinition | null>(null)
  const materialLibrary = shallowRef<MaterialLibraryApi | null>(null)
  const blockIconCache = shallowRef<BlockIconCache | null>(null)
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
    statusMessage.value = config.loadingMessage
    try {
      const resolved = resolveRenderBundle(config.renderBundle)
      structureDefinition.value = resolved.definition
      materialLibrary.value = config.materialLibrary
      const iconCache = new BlockIconCache(
        config.materialLibrary,
        resolved.definition.blocks,
        resolved.modelRegistry,
        config.blockIconCacheOptions,
      )
      iconCache.setRevisionKey(
        `${resolved.definition.id}:${summarizeBlocksForCache(resolved.definition.blocks)}:${MC_ITEM_SLOT_BAKE_REVISION}:${BLOCK_ICON_LAYOUT_REVISION}:${blockIconBakeLayoutKey(config.blockIconCacheOptions)}`,
      )
      blockIconCache.value = iconCache
      loadStatus.value = 'ok'
      statusMessage.value = '正在构建网格…'
    } catch (e) {
      loadStatus.value = 'error'
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
      const result = await buildBlockMesh(def, lib, { layerPreview: layerPreviewMode.value })
      if (seq !== meshBuildSeq) {
        result.dispose()
        return
      }
      contentGroupRef.value = result.group
      disposeContent = result.dispose
      scene.add(result.group)
    } catch (e) {
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
    sceneRef.value = null
  }

  watch(layerWorldY, () => {
    if (!structureDefinition.value || !sceneRef.value) return
    void rebuildContentMesh()
  })

  return {
    showBlockStatsSidebar: config.features.blockStatsSidebar,
    loadStatus,
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
