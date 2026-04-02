/**
 * 将 WikiRendererBootstrapOptions 转为 AppPreviewConfig（含 HTTP 加载阶段）。
 */

import type { AppPreviewConfig } from '@/preview/appPreviewConfig'
import { defaultWikiEmbedUi } from '@/preview/appPreviewConfig'
import { loadWikiPreviewSession } from '@/preview/wikiSession'
import type { WikiRendererBootstrapOptions } from './wikiRendererContract'

export async function resolveBootstrapToAppConfig(
  options: WikiRendererBootstrapOptions,
): Promise<AppPreviewConfig> {
  const features = {
    ...defaultWikiEmbedUi.features,
    ...options.features,
  }
  const ui = options.ui ?? {}

  const { sceneId, apiPrefix } = options.data
  const { wikiRenderBundle, materialLibrary } = await loadWikiPreviewSession({
    sceneId,
    apiPrefix,
  })

  const out: AppPreviewConfig = {
    sceneId,
    wikiRenderBundle,
    materialLibrary,
    features,
    blockIconCacheOptions: {
      ...defaultWikiEmbedUi.blockIconCacheOptions,
      ...ui.blockIconCacheOptions,
    },
    initialLayerWorldY: ui.initialLayerWorldY ?? defaultWikiEmbedUi.initialLayerWorldY,
    initialProjectionMode: ui.initialProjectionMode ?? defaultWikiEmbedUi.initialProjectionMode,
    sceneBackground: ui.sceneBackground ?? defaultWikiEmbedUi.sceneBackground,
    loadingMessage: ui.loadingMessage ?? defaultWikiEmbedUi.loadingMessage,
    okMessage: ui.okMessage ?? defaultWikiEmbedUi.okMessage,
  }
  return out
}
