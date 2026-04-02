/**
 * 本地 dev 入口：默认配置 + URL 查询参数 → AppPreviewConfig；场景数据仅经 Mock HTTP（GET /preview-api/…）拉取，不使用 localStorage。
 */

import type { AppPreviewConfig } from '@/preview/appPreviewConfig'
import { defaultWikiEmbedUi } from '@/preview/appPreviewConfig'
import { DEFAULT_PREVIEW_SCENE_ID, getWikiRenderBundle } from '@/preview/previewDevServer'
import { parseUrlPreviewParams } from '@/preview/urlPreviewParams'

const defaultDevPreviewBase: Omit<AppPreviewConfig, 'wikiRenderBundle'> = {
  ...defaultWikiEmbedUi,
  features: {
    blockStatsSidebar: true,
    layerBar: true,
    developerPanel: Boolean(import.meta.env.DEV),
  },
}

function resolveSceneIdForBundle(config: Partial<AppPreviewConfig>): string {
  const s = config.sceneId
  if (s === undefined || s === '') return DEFAULT_PREVIEW_SCENE_ID
  return s
}

export async function resolveDevPreviewConfigAsync(): Promise<AppPreviewConfig> {
  const url = parseUrlPreviewParams()
  const { features: urlFeatures, ...urlRest } = url

  const mergedBase: Omit<AppPreviewConfig, 'wikiRenderBundle'> = {
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

  const sceneIdForBundle = resolveSceneIdForBundle(mergedBase)
  const wikiRenderBundle = await getWikiRenderBundle(sceneIdForBundle)

  return {
    ...mergedBase,
    wikiRenderBundle,
    sceneId: mergedBase.sceneId === '' || mergedBase.sceneId === undefined ? undefined : mergedBase.sceneId,
    okMessage: mergedBase.okMessage ?? defaultWikiEmbedUi.okMessage,
    loadingMessage: mergedBase.loadingMessage ?? defaultWikiEmbedUi.loadingMessage,
  }
}
