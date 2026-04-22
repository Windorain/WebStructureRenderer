/**
 * 由可编辑文档构建 AppShell 所需的 PreviewConfig（baked + 校验失败时抛错，由调用方捕获）。
 */

import type { PreviewConfig, PreviewFeatures } from '@/preview/previewConfig'
import { defaultEmbedUi } from '@/preview/previewConfig'
import { resolveBootstrapToPreviewConfig } from '@/embed/embedContract'
import { isBakedStructureData, isWorldDocument } from '@/render/data/bundleResolve'
import { embeddedStructure } from '@/render/data/worldPlayback'
import type { StructureData } from '@/render/schema/types'

function sceneKeyFromDocument(document: unknown): string {
  if (document && typeof document === 'object' && 'id' in document) {
    const id = (document as { id: unknown }).id
    if (typeof id === 'string' && id.length > 0) return id
  }
  return 'scene'
}

/**
 * 文档是否可能通过打包校验（用于 UI 提示，非严格等价于 validate）。
 * Compact 信封须先经 {@link normalizeSceneDocumentForWiki} 再调用；工作台预览链已按此处理。
 */
export function documentLooksPreviewable(document: unknown): boolean {
  if (!document || typeof document !== 'object') return false
  const blobs = (document as { textureBlobs?: unknown }).textureBlobs
  if (!Array.isArray(blobs) || blobs.length === 0) return false
  if (isWorldDocument(document)) {
    return document.frames.some((fr) => {
      const st = embeddedStructure(fr)
      return isBakedStructureData(st)
    })
  }
  return isBakedStructureData(document as StructureData)
}

export interface PreviewFromDocumentOptions {
  /** 覆盖默认嵌入 UI（工作台 dev 面板等） */
  features?: Partial<PreviewFeatures>
}

export async function previewConfigFromDocument(
  document: unknown,
  options: PreviewFromDocumentOptions = {},
): Promise<PreviewConfig> {
  const features: PreviewFeatures = {
    ...defaultEmbedUi.features,
    blockStatsSidebar: true,
    layerBar: true,
    ...options.features,
  }
  const cfg = await resolveBootstrapToPreviewConfig({
    data: { document },
    features,
    ui: {
      loadingMessage: defaultEmbedUi.loadingMessage,
      okMessage: defaultEmbedUi.okMessage,
    },
  })
  const key = sceneKeyFromDocument(document)
  if (key !== cfg.sceneId) {
    return { ...cfg, sceneId: key }
  }
  return cfg
}
