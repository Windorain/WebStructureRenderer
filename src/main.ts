/**
 * 库入口（IIFE）：mount、类型与数据校验 API。
 *
 * 不包含 SDE Workbench 整站（WorkbenchRoot 等）；后者见 main-workbench.ts 与 vite.workbench.config.ts，产物为 dist-workbench/（含 bundled/ 下的打包分块，勿与库 dist/ 或场景导出混淆）。
 * 灰机/wiki 嵌入只需 npm run build:lib，勿部署 dist-workbench。
 */

import '@/styles/nei-tokens.css'

export const MOUNT_SELECTOR = '#web-structure-renderer'

export { mount } from './embed/mount'
export type { EmbedBootstrapOptions, EmbedData, EmbedUiOptions, PreviewFeatures } from './embed/embedContract'
export type { PreviewConfig } from './preview/previewConfig'

export { loadPreviewSessionFromDocument } from './preview/previewSession'
export {
  normalizeEnvelopeToPlain,
  readDocumentFormat,
  isEnvelopeDocument,
  readSceneMetaField,
  sceneStableStringIdFromDocument,
} from './render/data/compactSceneDocument'
export { ENVELOPE_META_KEYS, ROOT_META_FORM_KEYS } from './render/data/compactMetaKeys'
export type { EnvelopeMetaKey, RootMetaFormKey } from './render/data/compactMetaKeys'
export type { EnvelopeDocument, DocumentFormat } from './render/schema/types'
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
  buildEnvelopePackage,
  type BuildEnvelopeOptions,
} from './render/data/sceneExport'
export { downloadJson, copyTextToClipboard } from './util/browser'
export { previewConfigFromDocument, documentLooksPreviewable } from './preview/previewFromDocument'
export type { PreviewFromDocumentOptions } from './preview/previewFromDocument'
