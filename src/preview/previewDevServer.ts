/**
 * 开发时：从 Mock HTTP（/preview-api）拉取 bundle 与场景列表。
 */

import type { WikiRenderBundle } from '@/render/schema/types'

import { fetchWikiRenderBundle } from './fetchWikiBundle'
import { listDiskSceneIds } from './serverCatalog'

/** 默认场景：与 `data/server/scenes` 下目录名一致 */
export const DEFAULT_PREVIEW_SCENE_ID = 'industrial_electrolyzer.simple'

export async function listSelectableSceneIds(): Promise<string[]> {
  return listDiskSceneIds()
}

export async function getWikiRenderBundle(sceneId: string): Promise<WikiRenderBundle> {
  return fetchWikiRenderBundle(sceneId)
}
