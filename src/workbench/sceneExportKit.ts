/**
 * 与 UI 解耦的导出/变换：供导出面板与库入口复用。
 */

import pako from 'pako'

import type { CompactSceneEnvelope } from '@/render/schema/types'
import { COMPACT_PAYLOAD_ENCODING } from '@/render/schema/types'

const META_KEYS_DEFAULT = [
  'id',
  'label',
  'author',
  'mode',
  'gtnhVersion',
  'structureId',
  'schemaVersion',
  'documentFormat',
] as const

function uint8ToBase64(bytes: Uint8Array): string {
  let bin = ''
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk))
  }
  return btoa(bin)
}

/** 浅合并 patch 到文档根（用于元数据编辑）；document 应为可变克隆。 */
export function patchSceneMetadataRoot(
  document: unknown,
  patch: Record<string, unknown>,
): Record<string, unknown> {
  if (document === null || typeof document !== 'object' || Array.isArray(document)) {
    throw new Error('document 须为非 null 对象')
  }
  return { ...(document as Record<string, unknown>), ...patch }
}

export interface BuildCompactOptions {
  /** 写入 Compact 信封 meta 的键（来自原文档根） */
  metaKeys?: readonly string[]
}

/**
 * 将完整 Raw 文档打成 Compact 信封（gzip+base64 payload；解压后与 meta 浅合并）。
 */
export function buildCompactEnvelope(
  document: unknown,
  options: BuildCompactOptions = {},
): CompactSceneEnvelope {
  const keys = options.metaKeys ?? META_KEYS_DEFAULT
  const src = document as Record<string, unknown>
  const meta: Record<string, unknown> = {}
  for (const k of keys) {
    if (Object.prototype.hasOwnProperty.call(src, k)) {
      meta[k] = src[k]
    }
  }
  const raw = JSON.stringify(document)
  const gz = pako.gzip(raw)
  const payload = uint8ToBase64(gz)
  return {
    documentFormat: 'Compact',
    payloadEncoding: COMPACT_PAYLOAD_ENCODING,
    meta,
    payload,
  }
}

export function downloadJson(filename: string, data: unknown, pretty = true): void {
  const text = pretty ? `${JSON.stringify(data, null, 2)}\n` : `${JSON.stringify(data)}\n`
  const blob = new Blob([text], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename.endsWith('.json') ? filename : `${filename}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function downloadTextFile(filename: string, text: string, mime = 'text/plain;charset=utf-8'): void {
  const blob = new Blob([text], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function downloadBlob(filename: string, blob: Blob): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export async function copyTextToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }
  const ta = document.createElement('textarea')
  ta.value = text
  ta.style.position = 'fixed'
  ta.style.left = '-9999px'
  document.body.appendChild(ta)
  ta.select()
  document.execCommand('copy')
  document.body.removeChild(ta)
}
