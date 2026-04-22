/**
 * 库入口（IIFE）：mount、类型与数据校验 API。
 *
 * 不包含 SDE Workbench 整站（WorkbenchRoot 等）；后者见 main-workbench.ts 与 vite.workbench.config.ts，产物为 dist-workbench/（含 bundled/ 下的打包分块，勿与库 dist/ 或场景导出混淆）。
 * 灰机/wiki 嵌入只需 npm run build:lib，勿部署 dist-workbench。
 */

import '@/styles/nei-tokens.css'

export const MOUNT_SELECTOR = '#wiki-multi-structure-render'

export { mount } from './embed/mount'
export type { EmbedBootstrapOptions, EmbedData, EmbedUiOptions, PreviewFeatures } from './embed/embedContract'
export type { PreviewConfig } from './preview/previewConfig'

export { loadPreviewSessionFromDocument } from './preview/previewSession'
export {
  normalizeSceneDocumentForWiki,
  readDocumentFormat,
  isCompactSceneEnvelope,
  readSceneMetaField,
  sceneStableStringIdFromDocument,
} from './render/data/compactSceneDocument'
export { COMPACT_META_KEYS, ROOT_META_FORM_KEYS } from './render/data/compactMetaKeys'
export type { CompactMetaKey, RootMetaFormKey } from './render/data/compactMetaKeys'
export type { CompactSceneEnvelope, DocumentFormat } from './render/schema/types'
export { COMPACT_PAYLOAD_ENCODING } from './render/schema/types'

export {
  buildMaterialRegistryFromSceneDocument,
  resolveRenderBundle,
  validatePackedSceneDocument,
  validateRenderBundle,
  type RenderBundle,
  type RenderBundleResolveResult,
} from './render/data/bundleResolve'

export {
  patchSceneMetadataRoot,
  buildCompactEnvelope,
  downloadJson,
  copyTextToClipboard,
  type BuildCompactOptions,
} from './workbench/sceneExportKit'
export { previewConfigFromDocument, documentLooksPreviewable } from './workbench/previewFromDocument'
export type { PreviewFromDocumentOptions } from './workbench/previewFromDocument'
