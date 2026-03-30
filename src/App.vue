<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as THREE from 'three'

import electroDef from '@renderData/industrial_electrolyzer.simple.json'
import { loadSimpleDefinition } from '@/render/pipeline'
import { buildSimpleMesh } from '@/render/simpleMesh'

const container = ref<HTMLDivElement | null>(null)
let disposeScene: (() => void) | undefined

onMounted(async () => {
  const el = container.value
  if (!el) return

  const def = loadSimpleDefinition(electroDef)
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
  camera.position.set(8, 6, 10)
  camera.lookAt(0, 1, 0)

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(el.clientWidth, el.clientHeight)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  el.appendChild(renderer.domElement)

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

  const tick = () => {
    animationId = requestAnimationFrame(tick)
    group.rotation.y += 0.0025
    renderer.render(scene, camera)
  }
  tick()

  disposeScene = () => {
    cancelAnimationFrame(animationId)
    window.removeEventListener('resize', onResize)
    disposeMesh()
    renderer.dispose()
    if (renderer.domElement.parentNode === el) {
      el.removeChild(renderer.domElement)
    }
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
  border-radius: 8px;
  background: #0f172a;
  overflow: hidden;
}
</style>
