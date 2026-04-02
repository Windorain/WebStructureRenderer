/**
 * 库入口（IIFE）：mount、类型与数据校验 API。
 */

import '@/styles/nei-tokens.css'

export const MOUNT_SELECTOR = '#wiki-multi-structure-render'

export { mount } from './embed/mount'
export type { EmbedBootstrapOptions, EmbedData, EmbedUiOptions, PreviewFeatures } from './embed/embedContract'
export type { PreviewConfig } from './preview/previewConfig'

export {
  resolveRenderBundle,
  validateRenderBundle,
  type RenderBundle,
  type RenderBundleResolveResult,
} from './render/data/bundleResolve'
