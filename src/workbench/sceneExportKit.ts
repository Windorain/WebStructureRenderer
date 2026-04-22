/**
 * 与 UI 解耦的导出/变换：供导出面板与库入口复用。
 */

import pako from 'pako'

import {
  COMPACT_META_KEYS,
  ROOT_META_FORM_KEYS,
  omitCompactMetaKeys,
  pickCompactMeta,
  type RootMetaFormKey,
} from '@/render/data/compactMetaKeys'
import { isCompactSceneEnvelope } from '@/render/data/compactSceneDocument'
import type { CompactSceneEnvelope } from '@/render/schema/types'
import { COMPACT_PAYLOAD_ENCODING } from '@/render/schema/types'

export type { RootMetaFormKey }

function uint8ToBase64(bytes: Uint8Array): string {
  let bin = ''
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk))
  }
  return btoa(bin)
}

function base64ToUint8Array(b64: string): Uint8Array {
  const bin = atob(b64)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) {
    out[i] = bin.charCodeAt(i)
  }
  return out
}

/** 按当前 `meta` 重写 payload：解压 → 去掉元数据键 → 再 gzip（不改动 meta）。 */
export function rebuildCompactPayloadInPlace(envelope: CompactSceneEnvelope): void {
  const bytes = base64ToUint8Array(envelope.payload)
  let inflated: Uint8Array
  try {
    inflated = pako.ungzip(bytes)
  } catch {
    throw new Error('Compact payload gzip 解压失败')
  }
  const text = new TextDecoder('utf-8').decode(inflated)
  let inner: unknown
  try {
    inner = JSON.parse(text) as unknown
  } catch (e) {
    throw new Error(`Compact payload 非合法 JSON：${e instanceof Error ? e.message : String(e)}`)
  }
  if (inner === null || typeof inner !== 'object' || Array.isArray(inner)) {
    throw new Error('Compact payload 解压后须为 JSON 对象')
  }
  const body = omitCompactMetaKeys(inner as Record<string, unknown>)
  const gz = pako.gzip(JSON.stringify(body))
  envelope.payload = uint8ToBase64(gz)
}

/**
 * 载入/保存前：信封根上元数据键折入 `meta`，并净化 payload（去掉内层元数据键）。
 */
export function canonicalizeCompactInPlace(document: unknown): void {
  if (!isCompactSceneEnvelope(document)) return
  const doc = document as unknown as Record<string, unknown>
  const prevMeta =
    doc.meta !== null && typeof doc.meta === 'object' && !Array.isArray(doc.meta)
      ? (doc.meta as Record<string, unknown>)
      : {}
  let nextMeta = prevMeta
  let touched = false
  for (const k of COMPACT_META_KEYS) {
    if (Object.prototype.hasOwnProperty.call(doc, k)) {
      if (!touched) {
        nextMeta = { ...prevMeta }
        touched = true
      }
      nextMeta[k] = doc[k]
      delete doc[k]
    }
  }
  if (touched) {
    doc.meta = nextMeta
  }
  rebuildCompactPayloadInPlace(document as CompactSceneEnvelope)
}

/**
 * 按表单值合并：Raw 写根；Compact 只写 `meta` 并重编码 payload。
 */
export function mergeRootStringFields(
  document: unknown,
  fields: Record<RootMetaFormKey, string>,
): Record<string, unknown> {
  if (document === null || typeof document !== 'object' || Array.isArray(document)) {
    throw new Error('document 须为非 null 对象')
  }
  if (isCompactSceneEnvelope(document)) {
    const doc = JSON.parse(JSON.stringify(document)) as CompactSceneEnvelope
    const meta =
      doc.meta !== null && typeof doc.meta === 'object' && !Array.isArray(doc.meta)
        ? { ...(doc.meta as Record<string, unknown>) }
        : {}
    for (const k of ROOT_META_FORM_KEYS) {
      const v = fields[k]
      if (v === '') {
        delete meta[k]
      } else {
        meta[k] = v
      }
    }
    doc.meta = meta
    const env = doc as unknown as Record<string, unknown>
    for (const k of ROOT_META_FORM_KEYS) {
      delete env[k]
    }
    rebuildCompactPayloadInPlace(doc)
    return doc as unknown as Record<string, unknown>
  }
  const doc = { ...(document as Record<string, unknown>) }
  for (const k of ROOT_META_FORM_KEYS) {
    const v = fields[k]
    if (v === '') {
      delete doc[k]
    } else {
      doc[k] = v
    }
  }
  return doc
}

/** 元数据 patch：Raw 浅合并根；Compact 合并入 `meta` 并重编码 payload。 */
export function patchSceneMetadataRoot(
  document: unknown,
  patch: Record<string, unknown>,
): Record<string, unknown> {
  if (document === null || typeof document !== 'object' || Array.isArray(document)) {
    throw new Error('document 须为非 null 对象')
  }
  if (isCompactSceneEnvelope(document)) {
    const doc = JSON.parse(JSON.stringify(document)) as CompactSceneEnvelope
    const prev =
      doc.meta !== null && typeof doc.meta === 'object' && !Array.isArray(doc.meta)
        ? (doc.meta as Record<string, unknown>)
        : {}
    doc.meta = { ...prev, ...patch }
    const env = doc as unknown as Record<string, unknown>
    for (const k of Object.keys(patch)) {
      delete env[k]
    }
    rebuildCompactPayloadInPlace(doc)
    return doc as unknown as Record<string, unknown>
  }
  return { ...(document as Record<string, unknown>), ...patch }
}

export interface BuildCompactOptions {
  /** 默认 {@link COMPACT_META_KEYS} */
  metaKeys?: readonly string[]
}

/**
 * 将 **Raw 形**根对象打成 Compact（`meta` 明文 + 无元数据键的 gzip payload）。
 * 若传入仍为 Compact 信封，须先 {@link normalizeSceneDocumentForWiki}。
 */
export function buildCompactEnvelope(
  document: unknown,
  options: BuildCompactOptions = {},
): CompactSceneEnvelope {
  if (isCompactSceneEnvelope(document)) {
    throw new Error('buildCompactEnvelope 仅接受 Raw 形文档，请先 normalizeSceneDocumentForWiki')
  }
  const keys = options.metaKeys ?? COMPACT_META_KEYS
  const src = document as Record<string, unknown>
  const meta = pickCompactMeta(src, keys)
  const body = omitCompactMetaKeys(src, keys)
  const gz = pako.gzip(JSON.stringify(body))
  const payload = uint8ToBase64(gz)
  return {
    documentFormat: 'Compact',
    payloadEncoding: COMPACT_PAYLOAD_ENCODING,
    meta,
    payload,
  }
}

/** 将链接挂到 document 并延迟 revoke，避免下载尚未开始 blob URL 已失效（常见于 Chrome） */
function triggerBlobDownload(filename: string, blob: Blob): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.rel = 'noopener'
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
}

export function downloadJson(filename: string, data: unknown, pretty = true): void {
  const text = pretty ? `${JSON.stringify(data, null, 2)}\n` : `${JSON.stringify(data)}\n`
  const blob = new Blob([text], { type: 'application/json;charset=utf-8' })
  const name = filename.endsWith('.json') ? filename : `${filename}.json`
  triggerBlobDownload(name, blob)
}

export function downloadTextFile(filename: string, text: string, mime = 'text/plain;charset=utf-8'): void {
  const blob = new Blob([text], { type: mime })
  triggerBlobDownload(filename, blob)
}

export function downloadBlob(filename: string, blob: Blob): void {
  triggerBlobDownload(filename, blob)
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
