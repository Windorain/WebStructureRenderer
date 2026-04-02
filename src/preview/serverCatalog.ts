/**
 * 运行时通过 `/preview-api`（Mock wiki-mock + Vite 代理）拉取场景列表与 WikiRenderBundle。
 */

import type { WikiRenderBundle } from '@/render/schema/types'

import { fetchWikiRenderBundle } from './fetchWikiBundle'

const PREFIX = '/preview-api'

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${PREFIX}${path}`)
  const text = await res.text()
  if (!res.ok) {
    throw new Error(`预览 API ${path} 失败: ${res.status} ${text}`)
  }
  return JSON.parse(text) as T
}

export async function listDiskSceneIds(): Promise<string[]> {
  return fetchJson<string[]>('/scenes')
}

export async function getDiskWikiRenderBundle(sceneId: string): Promise<WikiRenderBundle> {
  return fetchWikiRenderBundle(sceneId)
}
