/**
 * 资源包索引：Vite glob → 相对键 rel → PNG 的打包 URL 或 mcmeta 原文。
 * 无 Three 依赖；供材质层与工具使用。
 *
 * 数据流：locator（namespace:path）→ rel（assets/.../textures/...）→ 查表。
 */

const DATA_RESOURCES_ANCHOR = '/data/resources/'

function viteGlobModuleToUrl(mod: unknown): string | undefined {
  if (typeof mod === 'string' && mod.length > 0) return mod
  if (mod !== null && typeof mod === 'object' && 'default' in mod) {
    const d = (mod as { default: unknown }).default
    if (typeof d === 'string' && d.length > 0) return d
  }
  return undefined
}

function viteGlobModuleToRaw(mod: unknown): string | undefined {
  if (typeof mod === 'string') return mod
  if (mod !== null && typeof mod === 'object' && 'default' in mod) {
    const d = (mod as { default: unknown }).default
    if (typeof d === 'string') return d
  }
  return undefined
}

function globPathToResourceRel(globPath: string): string {
  const normalized = globPath.replace(/\\/g, '/')
  const i = normalized.indexOf(DATA_RESOURCES_ANCHOR)
  if (i < 0) return normalized
  return normalized.slice(i + DATA_RESOURCES_ANCHOR.length)
}

/**
 * Minecraft 风格 ResourceLocator → `assets/.../textures/.../*.png`
 */
export function locatorToRelativePngPath(locator: string): string {
  const colon = locator.indexOf(':')
  if (colon < 0) throw new Error(`非法 locator（缺少命名空间）: ${locator}`)
  const ns = locator.slice(0, colon)
  const pathAfterNs = locator.slice(colon + 1)
  return `assets/${ns}/textures/${pathAfterNs}.png`
}

/** 同目录 `xxx.png` → `xxx.png.mcmeta` */
export function locatorToRelativeMcmetaPath(locator: string): string {
  return `${locatorToRelativePngPath(locator)}.mcmeta`
}

function collectPngEntries(modules: Record<string, unknown>): { rel: string; url: string }[] {
  const entries: { rel: string; url: string }[] = []
  for (const [globPath, mod] of Object.entries(modules)) {
    const url = viteGlobModuleToUrl(mod)
    if (!url) continue
    entries.push({ rel: globPathToResourceRel(globPath), url })
  }
  return entries
}

function collectMcmetaEntries(modules: Record<string, unknown>): { rel: string; raw: string }[] {
  const entries: { rel: string; raw: string }[] = []
  for (const [globPath, mod] of Object.entries(modules)) {
    const raw = viteGlobModuleToRaw(mod)
    if (raw === undefined) continue
    entries.push({ rel: globPathToResourceRel(globPath), raw })
  }
  return entries
}

function buildUrlIndexes(entries: { rel: string; url: string }[]): {
  byRel: Map<string, string>
  byRelLower: Map<string, string>
} {
  const byRel = new Map<string, string>()
  const byRelLower = new Map<string, string>()
  for (const { rel, url } of entries) {
    byRel.set(rel, url)
    const lower = rel.toLowerCase()
    if (!byRelLower.has(lower)) byRelLower.set(lower, url)
  }
  return { byRel, byRelLower }
}

function buildRawIndexes(entries: { rel: string; raw: string }[]): {
  byRel: Map<string, string>
  byRelLower: Map<string, string>
} {
  const byRel = new Map<string, string>()
  const byRelLower = new Map<string, string>()
  for (const { rel, raw } of entries) {
    byRel.set(rel, raw)
    const lower = rel.toLowerCase()
    if (!byRelLower.has(lower)) byRelLower.set(lower, raw)
  }
  return { byRel, byRelLower }
}

const pngModules = import.meta.glob(
  '../../../data/resources/assets/**/*.png',
  { eager: true, query: '?url', import: 'default' },
)

const mcmetaModules = import.meta.glob(
  '../../../data/resources/assets/**/*.png.mcmeta',
  { eager: true, query: '?raw', import: 'default' },
)

const { byRel: pngRelToUrl, byRelLower: pngRelLowerToUrl } = buildUrlIndexes(
  collectPngEntries(pngModules as Record<string, unknown>),
)

const { byRel: mcmetaRelToRaw, byRelLower: mcmetaRelLowerToRaw } = buildRawIndexes(
  collectMcmetaEntries(mcmetaModules as Record<string, unknown>),
)

/**
 * 将 locator 解析为 Vite 打包后的 PNG URL。
 */
export function resolveLocatorToUrl(locator: string): string {
  const rel = locatorToRelativePngPath(locator)
  const url = pngRelToUrl.get(rel) ?? pngRelLowerToUrl.get(rel.toLowerCase())
  if (url) return url

  if (pngRelToUrl.size === 0) {
    throw new Error(
      `资源包为空：未扫描到任何 PNG。locator=${locator} rel=${rel}`,
    )
  }
  throw new Error(`资源包中未找到纹理: locator=${locator} rel=${rel}`)
}

/**
 * 返回与 locator 同路径的 `.png.mcmeta` 原文；不存在则 `undefined`。
 */
export function resolveMcmetaRawForLocator(locator: string): string | undefined {
  const rel = locatorToRelativeMcmetaPath(locator)
  return mcmetaRelToRaw.get(rel) ?? mcmetaRelLowerToRaw.get(rel.toLowerCase())
}
