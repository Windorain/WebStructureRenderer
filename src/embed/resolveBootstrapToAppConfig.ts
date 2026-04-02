/**
 * 将 WikiRendererBootstrapOptions 转为运行时 AppPreviewConfig。
 */

import { validateWikiRenderBundle } from '@/render/data/pipeline'
import type { AppPreviewConfig } from '@/preview/appPreviewConfig'
import { defaultWikiEmbedUi } from '@/preview/appPreviewConfig'
import { fetchWikiRenderBundle } from '@/preview/fetchWikiBundle'
import type { WikiRendererBootstrapOptions } from './wikiRendererContract'

export async function resolveBootstrapToAppConfig(
  options: WikiRendererBootstrapOptions,
): Promise<AppPreviewConfig> {
  const features = {
    ...defaultWikiEmbedUi.features,
    ...options.features,
  }
  const ui = options.ui ?? {}

  let wikiRenderBundle: AppPreviewConfig['wikiRenderBundle']
  let sceneId: string | undefined

  if (options.data.mode === 'inline') {
    validateWikiRenderBundle(options.data.bundle)
    wikiRenderBundle = options.data.bundle
    sceneId = undefined
  } else {
    const sid = options.data.sceneId
    wikiRenderBundle = await fetchWikiRenderBundle(sid, options.data.apiPrefix)
    sceneId = sid
  }

  return {
    wikiRenderBundle,
    sceneId,
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
}
