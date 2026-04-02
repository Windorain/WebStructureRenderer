/**
 * 库入口：挂载 Wiki 结构渲染器（显式 bootstrap，无隐式配置）。
 */

import { createApp } from 'vue'

import WikiRendererRoot from '@/embed/WikiRendererRoot.vue'

import type { WikiRendererBootstrapOptions } from './wikiRendererContract'

export function mountWikiRenderer(
  target: string | Element | null | undefined,
  options: WikiRendererBootstrapOptions,
): void {
  const el =
    target == null
      ? document.querySelector('#wiki-multi-structure-render')
      : typeof target === 'string'
        ? document.querySelector(target)
        : target
  if (!el) {
    console.warn('[WikiMultiStructureRender] mountWikiRenderer: 未找到挂载节点', target ?? '#wiki-multi-structure-render')
    return
  }
  createApp(WikiRendererRoot, { bootstrap: options }).mount(el)
}
