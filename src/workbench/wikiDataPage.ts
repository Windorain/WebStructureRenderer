import { formatSdeError } from '@/workbench/sdeApi'

declare const mw: {
  Api: new () => {
    get<T = unknown>(params: Record<string, unknown>): Promise<T>
    postWithToken<T = unknown>(tokenType: string, params: Record<string, unknown>): Promise<T>
  }
}

export interface WikiDataPageRevision {
  revid: number | null
  text: string
  document: unknown
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === 'object' && !Array.isArray(v)
}

function extractPageRecord(query: unknown): Record<string, unknown> {
  if (!isRecord(query)) {
    throw new Error('Wiki API 返回格式错误')
  }
  const pages = query.query
  if (!isRecord(pages) || !Array.isArray(pages.pages) || pages.pages.length === 0) {
    throw new Error('Wiki API 未返回页面数据')
  }
  const page = pages.pages[0]
  if (!isRecord(page)) {
    throw new Error('Wiki API 页面数据格式错误')
  }
  if (page.missing) {
    throw new Error('页面不存在')
  }
  return page
}

function extractContentFromPage(page: Record<string, unknown>): string {
  const revisions = Array.isArray(page.revisions) ? page.revisions : []
  const rev = revisions[0]
  if (!isRecord(rev)) {
    throw new Error('Wiki API 未返回修订内容')
  }
  const slots = isRecord(rev.slots) ? rev.slots : undefined
  const main = slots && isRecord(slots.main) ? slots.main : undefined
  const content =
    (main && typeof main.content === 'string' && main.content) ||
    (typeof rev.content === 'string' && rev.content) ||
    (typeof rev['*'] === 'string' && rev['*']) ||
    ''
  if (!content) {
    throw new Error('Wiki API 修订内容为空')
  }
  return content
}

export function normalizeWikiDataTitle(raw: string): string {
  const title = raw.trim()
  if (!title) {
    throw new Error('Data 页面标题不能为空')
  }
  if (!/^Data:/i.test(title)) {
    throw new Error('Data 页面标题必须以 Data: 开头')
  }
  return title
}

export function buildWikiDataPageUrl(title: string): string {
  return `/wiki/${encodeURIComponent(title)}`
}

export async function fetchWikiDataPage(title: string): Promise<WikiDataPageRevision> {
  if (typeof mw === 'undefined' || !mw?.Api) {
    throw new Error('当前页面缺少 MediaWiki API 运行时')
  }
  const api = new mw.Api()
  const res = await api.get({
    action: 'query',
    prop: 'revisions',
    titles: title,
    rvprop: 'ids|content',
    rvslots: 'main',
    formatversion: 2,
  })
  const page = extractPageRecord(res)
  const revisions = Array.isArray(page.revisions) ? page.revisions : []
  const rev = revisions[0]
  const revid = isRecord(rev) && typeof rev.revid === 'number' ? rev.revid : null
  const text = extractContentFromPage(page)
  const document = JSON.parse(text) as unknown
  return { revid, text, document }
}

export async function saveWikiDataPage(
  title: string,
  text: string,
  summary: string,
  baserevid: number | null,
): Promise<void> {
  if (typeof mw === 'undefined' || !mw?.Api) {
    throw new Error('当前页面缺少 MediaWiki API 运行时')
  }
  const api = new mw.Api()
  const payload: Record<string, unknown> = {
    action: 'edit',
    title,
    text,
    summary,
    formatversion: 2,
    assert: 'user',
  }
  if (baserevid !== null) {
    payload.baserevid = baserevid
  }
  try {
    await api.postWithToken('csrf', payload)
  } catch (e) {
    throw new Error(formatSdeError(e))
  }
}
