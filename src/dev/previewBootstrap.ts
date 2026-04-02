/**
 * 本地 dev：URL 参数与默认 UI → AppPreviewConfig；数据经 loadWikiPreviewSession 一次拉齐。
 */

import type { AppPreviewConfig } from '@/preview/appPreviewConfig'
import { defaultWikiEmbedUi } from '@/preview/appPreviewConfig'
import {
  DEFAULT_PREVIEW_SCENE_ID,
  loadWikiPreviewSession,
} from '@/preview/wikiSession'
import { parseUrlPreviewParams } from '@/preview/urlPreviewParams'

const defaultDevPreviewBase: Omit<
  AppPreviewConfig,
  'wikiRenderBundle' | 'materialLibrary' | 'sceneId'
> = {
  ...defaultWikiEmbedUi,
  features: {
    blockStatsSidebar: true,
    layerBar: true,
    developerPanel: Boolean(import.meta.env.DEV),
  },
}

function resolveSceneId(config: Partial<AppPreviewConfig>): string {
  const s = config.sceneId
  if (s === undefined || s === '') return DEFAULT_PREVIEW_SCENE_ID
  return s
}

export async function resolveDevPreviewConfigAsync(): Promise<AppPreviewConfig> {
  const url = parseUrlPreviewParams()
  const { features: urlFeatures, ...urlRest } = url

  const mergedBase: Omit<AppPreviewConfig, 'wikiRenderBundle' | 'materialLibrary' | 'sceneId'> = {
    ...defaultDevPreviewBase,
    ...urlRest,
    features: {
      ...defaultDevPreviewBase.features,
      ...(urlFeatures ?? {}),
    },
    blockIconCacheOptions: {
      ...defaultDevPreviewBase.blockIconCacheOptions,
      ...(url.blockIconCacheOptions ?? {}),
    },
  }

  const sceneId = resolveSceneId({ ...mergedBase, ...url })
  const { wikiRenderBundle, materialLibrary } = await loadWikiPreviewSession({
    sceneId,
    apiPrefix: '/preview-api',
  })

  const out: AppPreviewConfig = {
    ...mergedBase,
    sceneId,
    wikiRenderBundle,
    materialLibrary,
    okMessage: mergedBase.okMessage ?? defaultWikiEmbedUi.okMessage,
    loadingMessage: mergedBase.loadingMessage ?? defaultWikiEmbedUi.loadingMessage,
  }
  return out
}
