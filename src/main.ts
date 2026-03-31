/**
 * 库入口：挂载 Vue 应用。
 *
 * 数据流：选择 DOM 节点 → createApp(App) → 子组件内完成 StructureData 加载与 Three.js 场景（见 App.vue）。
 */

import { createApp } from 'vue'
import App from './App.vue'
import '@/styles/nei-tokens.css'

/** 灰机 Wiki 页面中与模板约定的挂载点 */
export const MOUNT_SELECTOR = '#wiki-multi-structure-render'

export function mount(target?: string | Element | null) {
  const el =
    target == null
      ? document.querySelector(MOUNT_SELECTOR)
      : typeof target === 'string'
        ? document.querySelector(target)
        : target
  if (!el) {
    console.warn('[WikiMultiStructureRender] 未找到挂载节点', target ?? MOUNT_SELECTOR)
    return
  }
  createApp(App).mount(el)
}

if (typeof document !== 'undefined') {
  mount()
}
