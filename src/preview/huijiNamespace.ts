/**
 * 灰机 Wiki Namespace/Data API 响应解析（与 server/wiki-mock 的 HTTP 层成对；不 import 服务端代码）。
 */

const DEFAULT_PREFIX = '/namespace'

export interface NamespaceDataDoc {
  _id: string
  title: string
  namespace: 'Data'
  payload: { kind: 'scene'; sceneId: string }
  updatedAt: string | null
}

export type HuijiNamespaceOk<T> = { success: true; data: T }
export type HuijiNamespaceErr = { success: false; error: { code: string; message: string } }

function parseHuijiBody<T>(text: string, httpStatus: number): T {
  let body: unknown
  try {
    body = JSON.parse(text) as unknown
  } catch {
    throw new Error(`Namespace API 返回非 JSON（HTTP ${httpStatus}）`)
  }
  if (typeof body !== 'object' || body === null || !('success' in body)) {
    throw new Error(`Namespace API 响应缺少 success 字段（HTTP ${httpStatus}）`)
  }
  const s = (body as { success: unknown }).success
  if (s === false) {
    const err = body as HuijiNamespaceErr
    const msg = err.error?.message ?? err.error?.code ?? 'unknown error'
    throw new Error(`Namespace API: ${msg}`)
  }
  if (s !== true) {
    throw new Error(`Namespace API: success 非布尔（HTTP ${httpStatus}）`)
  }
  return (body as HuijiNamespaceOk<T>).data
}

/** URL 安全 Base64（与 wiki-mock decodeBase64Url 对应） */
export function encodeNamespaceAggrSegment(pipeline: unknown[]): string {
  const json = JSON.stringify(pipeline)
  const b64 = btoa(unescape(encodeURIComponent(json)))
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export async function fetchNamespaceDataList(
  apiPrefix: string = DEFAULT_PREFIX,
): Promise<NamespaceDataDoc[]> {
  const base = apiPrefix.replace(/\/$/, '')
  const res = await fetch(`${base}/data`)
  const text = await res.text()
  return parseHuijiBody<NamespaceDataDoc[]>(text, res.status)
}

export async function fetchNamespaceDataByTitle(
  title: string,
  apiPrefix: string = DEFAULT_PREFIX,
): Promise<NamespaceDataDoc> {
  const base = apiPrefix.replace(/\/$/, '')
  const enc = encodeURIComponent(title)
  const res = await fetch(`${base}/data/${enc}`)
  const text = await res.text()
  return parseHuijiBody<NamespaceDataDoc>(text, res.status)
}

/** 聚合结果：文档数组或 `$count` 等产生的行 */
export async function fetchNamespaceDataAggregate(
  pipeline: unknown[],
  apiPrefix: string = DEFAULT_PREFIX,
): Promise<unknown[]> {
  const base = apiPrefix.replace(/\/$/, '')
  const seg = encodeNamespaceAggrSegment(pipeline)
  const res = await fetch(`${base}/data_aggr/${seg}`)
  const text = await res.text()
  return parseHuijiBody<unknown[]>(text, res.status)
}
