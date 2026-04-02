/**
 * 从 Mock/生产同源路径拉取 WikiRenderBundle（JSON 解析 + pipeline 校验）。
 */

import { validateWikiRenderBundle } from '@/render/data/pipeline'
import type { WikiRenderBundle } from '@/render/schema/types'

const DEFAULT_PREFIX = '/preview-api'

export async function fetchWikiRenderBundle(
  sceneId: string,
  apiPrefix: string = DEFAULT_PREFIX,
): Promise<WikiRenderBundle> {
  const enc = encodeURIComponent(sceneId)
  const path = `${apiPrefix.replace(/\/$/, '')}/scenes/${enc}/bundle`
  const res = await fetch(path)
  const text = await res.text()
  if (!res.ok) {
    throw new Error(`拉取 bundle 失败: ${res.status} ${text}`)
  }
  const raw = JSON.parse(text) as WikiRenderBundle
  validateWikiRenderBundle(raw)
  return raw
}
