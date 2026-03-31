<script setup lang="ts">
/**
 * 预览页：loadSimpleModel → SimpleMaterialLibrary + buildSimpleMesh → Scene。
 * RenderViewport：Renderer + 透视/正交 + OrbitControls；RAF：材质 tick → controls → render。
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import * as THREE from 'three'

import electroDef from '@renderData/models/industrial_electrolyzer.simple.json'
import materialRegistryJson from '@renderData/registries/material_registry.json'
import { applyInitialCamera } from '@/render/initialCamera'
import { SimpleMaterialLibrary } from '@/render/materials/simpleMaterialLibrary'
import { loadSimpleModel } from '@/render/pipeline'
import { buildSimpleMesh } from '@/render/simpleMesh'
import type { MaterialRegistryData } from '@/render/types'
import {
  RenderViewport,
  type ProjectionMode,
} from '@/render/viewport/renderViewport'

type ViewStatus = 'loading' | 'ok' | 'error'

const container = ref<HTMLDivElement | null>(null)
const status = ref<ViewStatus>('loading')
const statusMessage = ref('正在初始化 WebGL 与网格…')
const projectionMode = ref<ProjectionMode>('perspective')

const projectionLabel = computed(() =>
  projectionMode.value === 'perspective' ? '透视投影' : '正交投影',
)

let disposeScene: (() => void) | undefined
let viewportRef: RenderViewport | null = null

function toggleProjection(): void {
  if (!viewportRef) return
  viewportRef.toggleMode()
  projectionMode.value = viewportRef.mode
}

const statusBarClass = computed(() => {
  if (status.value === 'ok') return 'wm-status-bar wm-status-bar--ok'
  if (status.value === 'error') return 'wm-status-bar wm-status-bar--err'
  return 'wm-status-bar wm-status-bar--loading'
})

function formatError(err: unknown): string {
  if (err instanceof Error) return err.message
  return String(err)
}

onMounted(async () => {
  const el = container.value
  if (!el) {
    status.value = 'error'
    statusMessage.value = '未找到画布容器 (ref 为空)'
    return
  }

  status.value = 'loading'
  statusMessage.value = '正在加载数据与构建网格…'

  try {
    const def = loadSimpleModel(electroDef)
    const materialLibrary = new SimpleMaterialLibrary(
      materialRegistryJson as MaterialRegistryData,
    )
    const { group, dispose: disposeMesh } = await buildSimpleMesh(def, materialLibrary)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x111827)
    scene.add(group)

    const viewport = new RenderViewport({
      container: el,
      width: el.clientWidth,
      height: el.clientHeight,
    })
    viewportRef = viewport
    projectionMode.value = viewport.mode

    const fallbackTarget = new THREE.Vector3(0, 2, 0)
    const fallbackPosition = new THREE.Vector3(8, 6, 10)

    applyInitialCamera(
      viewport.perspectiveCamera,
      viewport.controls,
      def,
      fallbackTarget,
      fallbackPosition,
    )
    viewport.syncOrthographicFromPerspective()

    const ambient = new THREE.AmbientLight(0xffffff, 0.55)
    const dir = new THREE.DirectionalLight(0xffffff, 0.9)
    dir.position.set(6, 10, 8)
    scene.add(ambient, dir)

    let animationId = 0
    const onResize = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      viewport.resize(w, h)
    }
    window.addEventListener('resize', onResize)
    const resizeObserver = new ResizeObserver(() => onResize())
    resizeObserver.observe(el)

    const clock = new THREE.Clock()
    const tick = () => {
      animationId = requestAnimationFrame(tick)
      materialLibrary.tick(clock.getDelta() * 1000)
      viewport.controls.update()
      viewport.render(scene)
    }
    tick()

    status.value = 'ok'
    statusMessage.value = `渲染正常 · 模型 ${def.id} · 左键拖拽旋转 · 滚轮缩放 · 右上：世界轴（红+X 东 绿+Y 上 蓝+Z 南，对照 MC）`

    disposeScene = () => {
      viewportRef = null
      cancelAnimationFrame(animationId)
      resizeObserver.disconnect()
      window.removeEventListener('resize', onResize)
      viewport.dispose()
      disposeMesh()
      materialLibrary.dispose()
    }
  } catch (e) {
    status.value = 'error'
    statusMessage.value = formatError(e)
    console.error('[WikiMultiStructureRender]', e)
  }
})

onBeforeUnmount(() => {
  disposeScene?.()
})
</script>

<template>
  <div class="wm-root">
    <p class="wm-title">Industrial Electrolyzer — Simple 结构预览（GT5U 数据）</p>
    <div ref="container" class="wm-viewport">
      <button
        v-if="status === 'ok'"
        type="button"
        class="wm-projection-toggle"
        :title="`当前：${projectionLabel}，点击切换`"
        @click="toggleProjection"
      >
        {{ projectionLabel }}
      </button>
    </div>
    <div :class="statusBarClass" role="status" aria-live="polite">
      <span class="wm-status-dot" aria-hidden="true" />
      <span class="wm-status-text">{{ statusMessage }}</span>
    </div>
  </div>
</template>

<style scoped>
.wm-root {
  font-family: system-ui, sans-serif;
  color: #e5e5e5;
  padding: 8px;
}
.wm-title {
  margin: 0 0 8px;
  font-size: 14px;
  opacity: 0.9;
}
.wm-viewport {
  width: 100%;
  min-height: 320px;
  border-radius: 8px 8px 0 0;
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
.wm-status-bar {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 0;
  padding: 8px 10px;
  font-size: 12px;
  line-height: 1.45;
  font-family: ui-monospace, 'Cascadia Code', monospace;
  border-radius: 0 0 8px 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-top: none;
  background: #1e293b;
  color: #cbd5e1;
}
.wm-status-bar--loading {
  border-color: rgba(251, 191, 36, 0.35);
  color: #fde68a;
}
.wm-status-bar--ok {
  border-color: rgba(52, 211, 153, 0.35);
  color: #a7f3d0;
}
.wm-status-bar--err {
  border-color: rgba(248, 113, 113, 0.45);
  color: #fecaca;
  background: #3f1518;
}
.wm-status-dot {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  margin-top: 4px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.85;
}
.wm-status-text {
  flex: 1;
  word-break: break-word;
  white-space: pre-wrap;
}
</style>
