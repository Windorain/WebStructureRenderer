<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import electroDef from '@renderData/models/industrial_electrolyzer.simple.json'
import { loadSimpleModel } from '@/render/pipeline'
import { buildSimpleMesh } from '@/render/simpleMesh'

type ViewStatus = 'loading' | 'ok' | 'error'

const container = ref<HTMLDivElement | null>(null)
const status = ref<ViewStatus>('loading')
const statusMessage = ref('正在初始化 WebGL 与网格…')

let disposeScene: (() => void) | undefined

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
    const { group, dispose: disposeMesh } = await buildSimpleMesh(def)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x111827)
    scene.add(group)

    const camera = new THREE.PerspectiveCamera(
      50,
      Math.max(el.clientWidth, 1) / Math.max(el.clientHeight, 1),
      0.1,
      500,
    )
    const target = new THREE.Vector3(0, 2, 0)
    camera.position.set(8, 6, 10)
    camera.lookAt(target)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(el.clientWidth, el.clientHeight)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    el.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.copy(target)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.rotateSpeed = 0.9
    controls.enablePan = false

    const ambient = new THREE.AmbientLight(0xffffff, 0.55)
    const dir = new THREE.DirectionalLight(0xffffff, 0.9)
    dir.position.set(6, 10, 8)
    scene.add(ambient, dir)

    let animationId = 0
    const onResize = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)
    const resizeObserver = new ResizeObserver(() => onResize())
    resizeObserver.observe(el)

    const tick = () => {
      animationId = requestAnimationFrame(tick)
      controls.update()
      renderer.render(scene, camera)
    }
    tick()

    status.value = 'ok'
    statusMessage.value = `渲染正常 · 模型 ${def.id} · 左键拖拽旋转 · 滚轮缩放`

    disposeScene = () => {
      cancelAnimationFrame(animationId)
      resizeObserver.disconnect()
      window.removeEventListener('resize', onResize)
      controls.dispose()
      disposeMesh()
      renderer.dispose()
      if (renderer.domElement.parentNode === el) {
        el.removeChild(renderer.domElement)
      }
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
    <div ref="container" class="wm-viewport" />
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
