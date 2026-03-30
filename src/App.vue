<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import * as THREE from 'three'

const container = ref<HTMLDivElement | null>(null)
let animationId = 0
let dispose: (() => void) | undefined

onMounted(() => {
  const el = container.value
  if (!el) return

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    50,
    Math.max(el.clientWidth, 1) / Math.max(el.clientHeight, 1),
    0.1,
    1000,
  )
  camera.position.z = 3

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(el.clientWidth, el.clientHeight)
  el.appendChild(renderer.domElement)

  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshStandardMaterial({ color: 0x4ade80 })
  const cube = new THREE.Mesh(geometry, material)
  scene.add(cube)

  const ambient = new THREE.AmbientLight(0xffffff, 0.6)
  const dir = new THREE.DirectionalLight(0xffffff, 0.8)
  dir.position.set(2, 3, 4)
  scene.add(ambient, dir)

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
    cube.rotation.x += 0.01
    cube.rotation.y += 0.012
    renderer.render(scene, camera)
  }
  tick()

  dispose = () => {
    cancelAnimationFrame(animationId)
    window.removeEventListener('resize', onResize)
    geometry.dispose()
    material.dispose()
    renderer.dispose()
    if (renderer.domElement.parentNode === el) {
      el.removeChild(renderer.domElement)
    }
  }
})

onUnmounted(() => {
  dispose?.()
})
</script>

<template>
  <div class="wm-root">
    <p class="wm-title">Wiki Multi Structure Render（开发预览）</p>
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
  min-height: 280px;
  border-radius: 8px;
  background: #111827;
  overflow: hidden;
}
</style>
