<script setup lang="ts">
/**
 * Scene + RenderViewport + 灯光 + RAF；悬停拾取 emit 到父级（不持有 tooltip 状态）。
 */
import { inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as THREE from 'three'

import { PreviewSceneContextKey } from '@/preview/context'
import { applyDiagonalOrbitView, applyInitialCamera } from '@/render/initialCamera'
import type { LayerPreviewMode } from '@/render/layerPreview'
import { SimpleMaterialLibrary } from '@/render/materials/simpleMaterialLibrary'
import { pickBlockIdFromPointer } from '@/render/voxelPick'
import type { StructureDefinition } from '@/render/types'
import {
  RenderViewport,
  type ProjectionMode,
} from '@/render/viewport/renderViewport'

const props = withDefaults(
  defineProps<{
    definition: StructureDefinition
    materialLibrary: SimpleMaterialLibrary
    projectionMode: ProjectionMode
    contentGroup: THREE.Group | null
    layerPreviewMode: LayerPreviewMode
    sceneBackground?: number
  }>(),
  {
    sceneBackground: 0x111827,
  },
)

const emit = defineEmits<{
  ready: [scene: THREE.Scene]
  'update:projectionMode': [ProjectionMode]
  'hover-block': [
    payload: {
      blockId: string
      clientX: number
      clientY: number
      source: 'viewport'
    } | null,
  ]
}>()

const store = inject(PreviewSceneContextKey)

const container = ref<HTMLDivElement | null>(null)

let viewport: RenderViewport | null = null
let animationId = 0
let resizeObserver: ResizeObserver | null = null
let onResize: (() => void) | null = null

let canvasEl: HTMLElement | null = null
let rafHoverPending = false
let lastPointer: { clientX: number; clientY: number } | null = null

function toggleProjection(): void {
  if (!viewport) return
  viewport.toggleMode()
  emit('update:projectionMode', viewport.mode)
}

function runPick(): void {
  const vp = viewport
  const g = props.contentGroup
  const dom = canvasEl
  if (!vp || !g || !dom || !lastPointer) return

  const id = pickBlockIdFromPointer({
    clientX: lastPointer.clientX,
    clientY: lastPointer.clientY,
    domElement: dom,
    camera: vp.activeCamera,
    contentGroup: g,
    def: props.definition,
    layerPreview: props.layerPreviewMode,
  })

  if (id) {
    emit('hover-block', {
      blockId: id,
      clientX: lastPointer.clientX,
      clientY: lastPointer.clientY,
      source: 'viewport',
    })
  } else {
    emit('hover-block', null)
  }
}

function onPointerMove(e: PointerEvent): void {
  lastPointer = { clientX: e.clientX, clientY: e.clientY }
  if (rafHoverPending) return
  rafHoverPending = true
  requestAnimationFrame(() => {
    rafHoverPending = false
    runPick()
  })
}

function onPointerLeave(): void {
  lastPointer = null
  emit('hover-block', null)
}

watch(
  () => props.projectionMode,
  (m) => {
    viewport?.setMode(m)
  },
)

watch(
  [() => props.contentGroup, () => props.layerPreviewMode],
  () => {
    if (lastPointer) runPick()
  },
)

onMounted(() => {
  const el = container.value
  if (!el) return

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(props.sceneBackground)

  const ambient = new THREE.AmbientLight(0xffffff, 0.55)
  const dir = new THREE.DirectionalLight(0xffffff, 0.9)
  dir.position.set(6, 10, 8)
  scene.add(ambient, dir)

  const vp = new RenderViewport({
    container: el,
    width: el.clientWidth,
    height: el.clientHeight,
  })
  viewport = vp
  canvasEl = vp.renderer.domElement
  canvasEl.addEventListener('pointermove', onPointerMove)
  canvasEl.addEventListener('pointerleave', onPointerLeave)

  const def = props.definition
  const fallbackTarget = new THREE.Vector3(0, 2, 0)
  const fallbackPosition = new THREE.Vector3(8, 6, 10)

  applyInitialCamera(vp.perspectiveCamera, vp.controls, def, fallbackTarget, fallbackPosition)
  applyDiagonalOrbitView(vp.perspectiveCamera, vp.controls, {
    yawDeg: 225,
    elevationFromHorizontalDeg: 15,
  })
  vp.syncOrthographicFromPerspective()
  vp.setMode(props.projectionMode)

  onResize = () => {
    const w = el.clientWidth
    const h = el.clientHeight
    vp.resize(w, h)
  }
  window.addEventListener('resize', onResize)
  resizeObserver = new ResizeObserver(() => onResize?.())
  resizeObserver.observe(el)

  const clock = new THREE.Clock()
  const tick = () => {
    animationId = requestAnimationFrame(tick)
    props.materialLibrary.tick(clock.getDelta() * 1000)
    vp.controls.update()
    vp.render(scene)
  }
  tick()

  emit('ready', scene)
})

onBeforeUnmount(() => {
  if (canvasEl) {
    canvasEl.removeEventListener('pointermove', onPointerMove)
    canvasEl.removeEventListener('pointerleave', onPointerLeave)
    canvasEl = null
  }
  cancelAnimationFrame(animationId)
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  if (onResize) {
    window.removeEventListener('resize', onResize)
    onResize = null
  }
  store?.detachAndDisposeMesh()
  viewport?.dispose()
  viewport = null
})
</script>

<template>
  <div ref="container" class="wm-viewport">
    <button
      type="button"
      class="wm-projection-toggle"
      :title="`当前：${projectionMode === 'perspective' ? '透视投影' : '正交投影'}，点击切换`"
      @click="toggleProjection"
    >
      {{ projectionMode === 'perspective' ? '透视投影' : '正交投影' }}
    </button>
  </div>
</template>

<style scoped>
.wm-viewport {
  width: 100%;
  min-height: 320px;
  border-radius: 0;
  background: #0f172a;
  overflow: hidden;
  position: relative;
}
.wm-projection-toggle {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 2;
  padding: 6px 10px;
  font-size: 12px;
  font-family: ui-monospace, 'Cascadia Code', monospace;
  color: #e2e8f0;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.35);
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
}
.wm-projection-toggle:hover {
  border-color: rgba(148, 163, 184, 0.6);
  background: rgba(30, 41, 59, 0.95);
}
.wm-projection-toggle:focus-visible {
  outline: 2px solid #38bdf8;
  outline-offset: 2px;
}
</style>
