/**
 * 资源包纹理 URL 解析。
 *
 * 数据流（单向）：
 *   data/resources/assets/**.png  ←── Vite import.meta.glob(?url, eager)
 *        → 每条记录 { 相对键 rel, 打包后的 URL }
 *        → 索引：精确键 + 全小写键（兼容文件名大小写不一致）
 *   游戏式 locator（命名空间:路径）→ 推导 rel → 查索引 → 返回可被 TextureLoader 使用的 URL
 */

/** glob 键中用于截出「相对 data/resources」路径的锚点 */
const DATA_RESOURCES_ANCHOR = '/data/resources/'

/**
 * Vite 对 `import.meta.glob(..., { query: '?url', eager: true })` 的注入结果在运行时可能是：
 * - 字符串：打包后的资源 URL（常见）
 * - `{ default: string }`：与 `import: 'default'` 组合时的形态
 * 只接受非空字符串，其它情况视为无效条目并跳过。
 */
function viteGlobModuleToUrl(mod: unknown): string | undefined {
  if (typeof mod === 'string' && mod.length > 0) return mod
  if (mod !== null && typeof mod === 'object' && 'default' in mod) {
    const d = (mod as { default: unknown }).default
    if (typeof d === 'string' && d.length > 0) return d
  }
  return undefined
}

/**
 * 将 glob 返回的模块路径转为与注册表一致的相对路径键。
 * 例：`../../data/resources/assets/foo/bar.png` → `assets/foo/bar.png`
 * 若键中不含锚点（不应发生），则退回整段规范化路径，便于暴露问题。
 */
function globPathToResourceRel(globPath: string): string {
  const normalized = globPath.replace(/\\/g, '/')
  const i = normalized.indexOf(DATA_RESOURCES_ANCHOR)
  if (i < 0) return normalized
  return normalized.slice(i + DATA_RESOURCES_ANCHOR.length)
}

interface AssetEntry {
  /** 与 locatorToRelativePngPath 输出一致的键，如 assets/ns/textures/.../x.png */
  rel: string
  /** Vite 产出的可请求 URL */
  url: string
}

/** 将 Vite glob 的原始表扫描为 { rel, url } 列表（中间表示，尚未建索引）。 */
function collectAssetEntries(
  modules: Record<string, unknown>,
): AssetEntry[] {
  const entries: AssetEntry[] = []
  for (const [globPath, mod] of Object.entries(modules)) {
    const url = viteGlobModuleToUrl(mod)
    if (!url) continue
    entries.push({ rel: globPathToResourceRel(globPath), url })
  }
  return entries
}

/**
 * 由扁平列表构建查询用索引：先精确匹配，再按路径全小写匹配（磁盘/仓库文件名大小写可能与注册表不一致）。
 */
function buildIndexes(entries: AssetEntry[]): {
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

/** 须在模块顶层：`import.meta.glob` 由 Vite 在构建期静态展开。 */
const assetModules = import.meta.glob(
  '../../data/resources/assets/**/*.png',
  { eager: true, query: '?url', import: 'default' },
)

const { byRel: relToUrl, byRelLower: relLowerToUrl } = buildIndexes(
  collectAssetEntries(assetModules),
)

/**
 * Minecraft 风格 ResourceLocator → 资源包内相对路径（不含 data/resources 前缀）。
 * 例：`miscutils:blocks/TileEntities/X` → `assets/miscutils/textures/blocks/TileEntities/X.png`
 */
export function locatorToRelativePngPath(locator: string): string {
  const colon = locator.indexOf(':')
  if (colon < 0) throw new Error(`非法 locator（缺少命名空间）: ${locator}`)
  const ns = locator.slice(0, colon)
  const pathAfterNs = locator.slice(colon + 1)
  return `assets/${ns}/textures/${pathAfterNs}.png`
}

/**
 * 将 locator 解析为 Vite 打包后的纹理 URL，供 Three.js TextureLoader 使用。
 */
export function resolveLocatorToUrl(locator: string): string {
  const rel = locatorToRelativePngPath(locator)
  const url = relToUrl.get(rel) ?? relLowerToUrl.get(rel.toLowerCase())
  if (url) return url

  if (relToUrl.size === 0) {
    throw new Error(
      `资源包为空：未扫描到任何 PNG（请确认本地存在 data/resources/assets 且含纹理；若从仓库克隆，需自备或同步资源文件）。locator=${locator} rel=${rel}`,
    )
  }
  throw new Error(`资源包中未找到纹理: locator=${locator} rel=${rel}`)
}
