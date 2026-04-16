/**
 * 资源定位符 → HTTP 路径（相对 `resources` 根下的 assets 树）。
 * 不含纹理加载；PNG 由 previewSession 经 HTTP 预取后注入材质库。
 */

/**
 * 与 SDE {@code ExportTextureLocator.normalizeLocatorForBundle} 对齐：方块图集路径在 {@code textures/} 下缺省时补 {@code blocks/}，
 * 以便 {@code miscutils:TileEntities/FOO} → 磁盘 {@code assets/miscutils/textures/blocks/TileEntities/FOO.png}。
 * <p>
 * 已含 {@code entity/}、{@code gui/} 等原版纹理根路径的 locator（如 TESR 导出的 {@code minecraft:entity/chest/normal}）
 * 不得再套 {@code blocks/}，否则会变成错误的 {@code textures/blocks/entity/...}。
 */
const EXPLICIT_MINECRAFT_TEXTURE_ROOTS = [
  'blocks/',
  'items/',
  'entity/',
  'gui/',
  'misc/',
  'environment/',
  'font/',
  'map/',
  'painting/',
  'particle/',
  'colormap/',
] as const

function pathHasExplicitTextureRoot(path: string): boolean {
  for (const root of EXPLICIT_MINECRAFT_TEXTURE_ROOTS) {
    if (path.startsWith(root)) {
      return true
    }
  }
  return false
}

export function normalizeLocatorForBundle(locator: string): string {
  let s = locator.trim()
  if (s.length === 0) {
    s = 'minecraft:missingno'
  } else if (s.indexOf(':') < 0) {
    /** 无命名空间时与 MC 资源键习惯一致，默认 {@code minecraft} */
    s = `minecraft:${s}`
  }
  const colon = s.indexOf(':')
  const ns = s.slice(0, colon)
  let path = s.slice(colon + 1)
  while (path.startsWith('textures/')) {
    path = path.slice('textures/'.length)
  }
  if (!pathHasExplicitTextureRoot(path)) {
    path = `blocks/${path}`
  }
  return `${ns}:${path}`
}

/**
 * Minecraft 风格 ResourceLocator → `assets/.../textures/.../*.png`
 */
export function locatorToRelativePngPath(locator: string): string {
  const normalized = normalizeLocatorForBundle(locator)
  const colon = normalized.indexOf(':')
  if (colon < 0) throw new Error(`非法 locator（缺少命名空间）: ${locator}`)
  const ns = normalized.slice(0, colon)
  const pathAfterNs = normalized.slice(colon + 1)
  // 部分导出写成 `ns:textures/blocks/...`，避免拼成 `.../textures/textures/...`
  if (pathAfterNs.startsWith('textures/')) {
    return `assets/${ns}/${pathAfterNs}.png`
  }
  return `assets/${ns}/textures/${pathAfterNs}.png`
}

/**
 * `resourcesBase` 为 `/preview-api/resources` 形式（无尾斜杠）。
 */
export function locatorToResourceUrl(locator: string, resourcesBase: string): string {
  const base = resourcesBase.replace(/\/$/, '')
  return `${base}/${locatorToRelativePngPath(locator)}`
}
