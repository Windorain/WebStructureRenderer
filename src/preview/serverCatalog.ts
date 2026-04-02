/**
 * 运行时通过 `/preview-api`（preview-http.mjs + Vite 代理）拉取场景列表与 WikiRenderBundle。
 * 场景目录须含 document + block + material + model 四件套；无 data/registries 回退。
 */

import type { WikiRenderBundle } from '@/render/schema/types'

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
  const enc = encodeURIComponent(sceneId)
  return fetchJson<WikiRenderBundle>(`/scenes/${enc}/bundle`)
}
