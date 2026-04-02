/**
 * 库入口（IIFE）：mountWikiRenderer、类型与数据校验 API。
 */

import '@/styles/nei-tokens.css'

export const MOUNT_SELECTOR = '#wiki-multi-structure-render'

export { mountWikiRenderer } from './embed/mountWikiRenderer'
export type {
  WikiRendererBootstrapOptions,
  WikiRendererData,
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
