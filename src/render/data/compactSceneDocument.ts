/**
 * Compact 场景 JSON：根级 `documentFormat: "Compact"`，明文 `meta` + gzip+Base64 的 `payload`。
 * Wiki 先据此路由，解压后与 `meta` 浅合并，得到与 Raw 相同的内存结构。
 */

import type { CompactSceneEnvelope, DocumentFormat } from '@/render/schema/types'
import { COMPACT_PAYLOAD_ENCODING } from '@/render/schema/types'

function base64ToUint8Array(b64: string): Uint8Array {
  const bin = atob(b64)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) {
    out[i] = bin.charCodeAt(i)
  }
  return out
}

async function gunzip(bytes: Uint8Array): Promise<Uint8Array> {
  if (typeof DecompressionStream === 'undefined') {
    throw new Error('当前环境不支持 DecompressionStream（gzip），无法解压 Compact 场景')
  }
  const ds = new DecompressionStream('gzip')
  const stream = new Blob([bytes]).stream().pipeThrough(ds)
  const buf = await new Response(stream).arrayBuffer()
  return new Uint8Array(buf)
}

export function isCompactSceneEnvelope(doc: unknown): doc is CompactSceneEnvelope {
  return (
    doc !== null &&
    typeof doc === 'object' &&
    !Array.isArray(doc) &&
    (doc as { documentFormat?: unknown }).documentFormat === 'Compact'
  )
}

/** 读取根级文档格式；缺省视为 Raw（兼容旧 JSON）。 */
export function readDocumentFormat(doc: unknown): DocumentFormat | undefined {
  if (doc === null || typeof doc !== 'object' || Array.isArray(doc)) return undefined
  const v = (doc as { documentFormat?: unknown }).documentFormat
  if (v === 'Compact' || v === 'Raw') return v
  return undefined
}

/**
 * 若为 Compact 信封则解压并合并；否则原样返回（Raw 或历史文件无 `documentFormat`）。
 */
export async function normalizeSceneDocumentForWiki(document: unknown): Promise<unknown> {
  if (!isCompactSceneEnvelope(document)) {
    return document
  }
  if (document.payloadEncoding !== COMPACT_PAYLOAD_ENCODING) {
    throw new Error(
      `不支持的 payloadEncoding：期望 "${COMPACT_PAYLOAD_ENCODING}"，实际为 ${String(document.payloadEncoding)}`,
    )
  }
  if (typeof document.payload !== 'string' || document.payload.length === 0) {
    throw new Error('Compact 文档缺少非空 payload 字符串')
  }
  const { meta } = document
  if (meta === null || typeof meta !== 'object' || Array.isArray(meta)) {
    throw new Error('Compact 文档缺少 meta 对象')
  }
  const bytes = base64ToUint8Array(document.payload)
  const decoded = await gunzip(bytes)
  const text = new TextDecoder('utf-8').decode(decoded)
  let inner: unknown
  try {
    inner = JSON.parse(text) as unknown
  } catch (e) {
    throw new Error(`Compact payload 非合法 JSON：${e instanceof Error ? e.message : String(e)}`)
  }
  if (inner === null || typeof inner !== 'object' || Array.isArray(inner)) {
    throw new Error('Compact payload 解压后须为 JSON 对象')
  }
  return { ...meta, ...inner }
}
