/**
 * 将 ResourceLocator 解析为 Vite 打包后的纹理 URL。
 * locator 示例：miscutils:blocks/TileEntities/MACHINE_CASING_STABLE_Potin
 * → assets/miscutils/textures/blocks/TileEntities/MACHINE_CASING_STABLE_Potin.png
 */
const assetModules = import.meta.glob<{ default: string }>(
  '../../data/resources/assets/**/*.png',
  { eager: true, query: '?url', import: 'default' },
)

function buildRelativeAssetMap(): Map<string, string> {
  const map = new Map<string, string>()
  for (const [filePath, mod] of Object.entries(assetModules)) {
    const normalized = filePath.replace(/\\/g, '/')
    const idx = normalized.indexOf('/data/resources/')
    const rel = idx >= 0 ? normalized.slice(idx + '/data/resources/'.length) : normalized
    map.set(rel, mod.default)
  }
  return map
}

const relToUrl = buildRelativeAssetMap()

export function locatorToRelativePngPath(locator: string): string {
  const colon = locator.indexOf(':')
  if (colon < 0) throw new Error(`非法 locator（缺少命名空间）: ${locator}`)
  const ns = locator.slice(0, colon)
  const pathAfterNs = locator.slice(colon + 1)
  return `assets/${ns}/textures/${pathAfterNs}.png`
}

export function resolveLocatorToUrl(locator: string): string {
  const rel = locatorToRelativePngPath(locator)
  const url = relToUrl.get(rel)
  if (!url) {
    throw new Error(`资源包中未找到纹理: locator=${locator} rel=${rel}`)
  }
  return url
}
