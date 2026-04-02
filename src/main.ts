/**
 * 库入口（IIFE）：对外暴露 mountWikiRenderer 与数据校验 API；无隐式 DOM 挂载。
 * 本地开发请使用 main-dev.ts（index.html 已指向）。
 */

import '@/styles/nei-tokens.css'

/** 灰机 Wiki 页面中与模板约定的挂载点 */
export const MOUNT_SELECTOR = '#wiki-multi-structure-render'

export { mountWikiRenderer } from './embed/mountWikiRenderer'
export type {
  WikiRendererBootstrapOptions,
  WikiRendererData,
  WikiRendererDataFetch,
  WikiRendererDataInline,
  WikiRendererFeatures,
  WikiRendererUiOptions,
} from './embed/wikiRendererContract'
export type { AppPreviewConfig } from './preview/appPreviewConfig'

export {
  resolveWikiRenderBundle,
  validateWikiRenderBundle,
  type WikiRenderBundle,
  type WikiRenderResolveResult,
} from './render/data/pipeline'
