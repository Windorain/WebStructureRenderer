/**
 * 构建时扫描 data/structures 下 JSON，供开发者面板列出可选结构。
 */

const structureJsonGlob = import.meta.glob<{ default?: unknown } | Record<string, unknown>>(
  '../../data/structures/**/*.json',
  { eager: true },
)

function globKeyToModuleId(key: string): string {
  const name = key.split(/[/\\]/).pop() ?? key
  return name.replace(/\.json$/i, '')
}

function modulePayload(data: { default?: unknown } | Record<string, unknown>): unknown {
  if (data && typeof data === 'object' && 'default' in data && data.default !== undefined) {
    return (data as { default: unknown }).default
  }
  return data
}

const idToData = new Map<string, unknown>()

for (const [key, mod] of Object.entries(structureJsonGlob)) {
  const id = globKeyToModuleId(key)
  idToData.set(id, modulePayload(mod as { default?: unknown }))
}

/** 已扫描到的结构模块 id（文件名去掉 .json），按字典序 */
export function listStructureModuleIds(): string[] {
  return [...idToData.keys()].sort((a, b) => a.localeCompare(b))
}

export function getStructureDataByModuleId(id: string): unknown | undefined {
  return idToData.get(id)
}
