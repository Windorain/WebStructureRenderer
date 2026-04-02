/**
 * 预览场景：结构、分层、网格、图标缓存与统计的单一编排点。
 */

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
import { summarizeBlocksForCache } from '@/render/interaction/blockSlotBaker'
import { MC_ITEM_SLOT_BAKE_REVISION } from '@/render/interaction/mcItemViewMatrix'
import type { LayerPreviewMode } from '@/render/data/layerPreview'
import { SimpleMaterialLibrary } from '@/render/materials/simpleMaterialLibrary'
import { resolveWikiRenderBundle } from '@/render/data/pipeline'
import { buildBlockMesh } from '@/render/mesh/blockMesh'
import type { StructureDefinition } from '@/render/schema/types'
import type { ProjectionMode } from '@/render/viewport/renderViewport'

import type { AppPreviewConfig } from './appPreviewConfig'

export type LoadStatus = 'loading' | 'ok' | 'error'

export interface PreviewSceneStore {
  /** 来自 AppPreviewConfig，是否渲染方块统计侧栏 */
  showBlockStatsSidebar: boolean
  loadStatus: Ref<LoadStatus>
  statusMessage: Ref<string>
  layerWorldY: Ref<number>
  meshBusy: Ref<boolean>
  projectionMode: Ref<ProjectionMode>
  structureDefinition: ShallowRef<StructureDefinition | null>
  materialLibrary: ShallowRef<SimpleMaterialLibrary | null>
  blockIconCache: ShallowRef<BlockIconCache | null>
  sizeRow: ComputedRef<number>
  layerPreviewMode: ComputedRef<LayerPreviewMode>
  blockStatsEntries: ComputedRef<BlockStatRow[]>
  projectionLabel: ComputedRef<string>
  layerPreviewLabel: ComputedRef<string>
  registerScene(scene: THREE.Scene): void
  loadStructureAndResources(): Promise<void>
  rebuildContentMesh(): Promise<void>
  /** 视口卸载前：移除 mesh 并释放几何体；不释放材质库与图标缓存 */
  detachAndDisposeMesh(): void
  /** 根组件 beforeUnmount：释放图标缓存、材质库与结构引用 */
  disposeCachesAndLibrary(): void
  /** 当前结构 mesh 组，供视口射线拾取等 */
  contentGroupRef: ShallowRef<THREE.Group | null>
}

function formatError(err: unknown): string {
  if (err instanceof Error) return err.message
  return String(err)
}

export function createPreviewSceneStore(config: AppPreviewConfig): PreviewSceneStore {
  const loadStatus = ref<LoadStatus>('loading')
  const statusMessage = ref(config.loadingMessage)
  const layerWorldY = ref(config.initialLayerWorldY)
  const meshBusy = ref(false)
  const projectionMode = ref<ProjectionMode>(config.initialProjectionMode)

  const structureDefinition = shallowRef<StructureDefinition | null>(null)
  const materialLibrary = shallowRef<SimpleMaterialLibrary | null>(null)
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
      const resolved = resolveWikiRenderBundle(config.wikiRenderBundle)
      structureDefinition.value = resolved.definition
      const lib = new SimpleMaterialLibrary(resolved.materialRegistry)
      materialLibrary.value = lib
      const iconCache = new BlockIconCache(
        lib,
        resolved.definition.blocks,
        resolved.modelRegistry,
        config.blockIconCacheOptions,
      )
      iconCache.setRevisionKey(
        `${resolved.definition.id}:${summarizeBlocksForCache(resolved.definition.blocks)}:${MC_ITEM_SLOT_BAKE_REVISION}:${BLOCK_ICON_LAYOUT_REVISION}:${blockIconBakeLayoutKey(config.blockIconCacheOptions)}`,
      )
      blockIconCache.value = iconCache
      loadStatus.value = 'ok'
      // 数据已就绪；完整「渲染正常」文案在视口 mesh 构建完成后由 App 写入
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
      // 数据已加载成功，仅标记网格构建失败，避免卸载视口
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
    showBlockStatsSidebar: config.showBlockStatsSidebar,
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
