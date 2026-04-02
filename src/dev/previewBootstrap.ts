/**
 * 本地 dev 入口：默认配置 + URL + localStorage → 完整 AppPreviewConfig（经 Mock HTTP 拉 bundle）。
 */

import type { AppPreviewConfig } from '@/preview/appPreviewConfig'
import { defaultWikiEmbedUi } from '@/preview/appPreviewConfig'
import { DEFAULT_PREVIEW_SCENE_ID, getWikiRenderBundle } from '@/preview/previewDevServer'
import { parseUrlPreviewParams } from '@/preview/urlPreviewParams'

import { loadPersistedDevPatch } from './previewPersistence'

const defaultDevPreviewBase: Omit<AppPreviewConfig, 'wikiRenderBundle'> = {
  ...defaultWikiEmbedUi,
  features: {
    blockStatsSidebar: true,
    layerBar: true,
    developerPanel: Boolean(import.meta.env.DEV),
  },
}

function resolveSceneIdForBundle(patch: Partial<AppPreviewConfig>): string {
  const s = patch.sceneId
  if (s === undefined || s === '') return DEFAULT_PREVIEW_SCENE_ID
  return s
}

export async function resolveDevPreviewConfigAsync(): Promise<AppPreviewConfig> {
  const url = parseUrlPreviewParams()
  const patch = loadPersistedDevPatch()

  const { features: urlFeatures, ...urlRest } = url
  const { features: patchFeatures, ...patchRest } = patch

  const mergedBase: Omit<AppPreviewConfig, 'wikiRenderBundle'> = {
    ...defaultDevPreviewBase,
    ...urlRest,
    ...patchRest,
    features: {
      ...defaultDevPreviewBase.features,
      ...(urlFeatures ?? {}),
      ...(patchFeatures ?? {}),
    },
    blockIconCacheOptions: {
      ...defaultDevPreviewBase.blockIconCacheOptions,
      ...(url.blockIconCacheOptions ?? {}),
      ...(patch.blockIconCacheOptions ?? {}),
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
