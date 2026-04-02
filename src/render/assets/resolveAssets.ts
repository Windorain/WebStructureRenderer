/**
 * 资源定位符 → HTTP 路径（相对 `resources` 根下的 assets 树）。
 * 不含纹理加载；PNG 由 wikiSession 经 HTTP 预取后注入材质库。
 */

/**
 * Minecraft 风格 ResourceLocator → `assets/.../textures/.../*.png`
 */
export function locatorToRelativePngPath(locator: string): string {
  const colon = locator.indexOf(':')
  if (colon < 0) throw new Error(`非法 locator（缺少命名空间）: ${locator}`)
  const ns = locator.slice(0, colon)
  const pathAfterNs = locator.slice(colon + 1)
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
