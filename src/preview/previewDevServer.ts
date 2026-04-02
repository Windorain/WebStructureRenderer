/**
 * 预览 bundle：仅通过 HTTP `/preview-api` 拉取（见 serverCatalog）。
 */

import { validateWikiRenderBundle } from '@/render/data/pipeline'
import type { WikiRenderBundle } from '@/render/schema/types'

import { getDiskWikiRenderBundle, listDiskSceneIds } from './serverCatalog'

/** 默认场景：与 `data/server/scenes` 下目录名一致 */
export const DEFAULT_PREVIEW_SCENE_ID = 'industrial_electrolyzer.simple'

export async function listSelectableSceneIds(): Promise<string[]> {
  return listDiskSceneIds()
}

export async function getWikiRenderBundle(sceneId: string): Promise<WikiRenderBundle> {
  const bundle = await getDiskWikiRenderBundle(sceneId)
  validateWikiRenderBundle(bundle)
  return bundle
}
