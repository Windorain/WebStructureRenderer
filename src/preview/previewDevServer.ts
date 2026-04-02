/**
 * 本地「模拟服务端」：磁盘 `data/server/scenes` + 浏览器内上传覆盖（localStorage）。
 * UI 仅通过本模块访问场景列表与 WikiRenderBundle，不直接 glob。
 */

import { validateWikiRenderBundle } from '@/render/data/pipeline'
import type { WikiRenderBundle } from '@/render/schema/types'

import { getDiskWikiRenderBundle, listDiskSceneIds } from './serverCatalog'

/** 默认场景：与 `data/server/scenes` 下目录名一致 */
export const DEFAULT_PREVIEW_SCENE_ID = 'industrial_electrolyzer.simple'

const UPLOAD_STORAGE_PREFIX = 'wmr-preview-upload-bundle:'
const UPLOAD_INDEX_KEY = 'wmr-preview-upload-ids'

function readUploadIndex(): string[] {
  if (typeof localStorage === 'undefined') return []
  try {
    const raw = localStorage.getItem(UPLOAD_INDEX_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? (parsed as string[]).filter((s) => typeof s === 'string') : []
  } catch {
    return []
  }
}

function writeUploadIndex(ids: string[]): void {
  if (typeof localStorage === 'undefined') return
  const unique = [...new Set(ids)].sort((a, b) => a.localeCompare(b))
  localStorage.setItem(UPLOAD_INDEX_KEY, JSON.stringify(unique))
}

function uploadStorageKey(sceneId: string): string {
  return `${UPLOAD_STORAGE_PREFIX}${sceneId}`
}

/** 磁盘场景 id ∪ 已上传 id */
export function listSelectableSceneIds(): string[] {
  const disk = listDiskSceneIds()
  const uploads = readUploadIndex()
  return [...new Set([...disk, ...uploads])].sort((a, b) => a.localeCompare(b))
}

export function isUploadedScene(sceneId: string): boolean {
  return readUploadIndex().includes(sceneId)
}

/** 上传覆盖优先，否则 `data/server/scenes` */
export function getWikiRenderBundle(sceneId: string): WikiRenderBundle {
  if (typeof localStorage !== 'undefined') {
    const raw = localStorage.getItem(uploadStorageKey(sceneId))
    if (raw) {
      try {
        const bundle = JSON.parse(raw) as WikiRenderBundle
        validateWikiRenderBundle(bundle)
        return bundle
      } catch {
        /* fall through to disk */
      }
    }
  }
  return getDiskWikiRenderBundle(sceneId)
}

export function defaultWikiRenderBundle(): WikiRenderBundle {
  return getWikiRenderBundle(DEFAULT_PREVIEW_SCENE_ID)
}

export function saveUploadedWikiRenderBundle(sceneId: string, bundle: WikiRenderBundle): void {
  if (typeof localStorage === 'undefined') throw new Error('localStorage 不可用')
  validateWikiRenderBundle(bundle)
  localStorage.setItem(uploadStorageKey(sceneId), JSON.stringify(bundle))
  const idx = readUploadIndex()
  if (!idx.includes(sceneId)) {
    writeUploadIndex([...idx, sceneId])
  }
}

export function removeUploadedScene(sceneId: string): void {
  if (typeof localStorage === 'undefined') return
  localStorage.removeItem(uploadStorageKey(sceneId))
  writeUploadIndex(readUploadIndex().filter((id) => id !== sceneId))
}
