import type { SimpleDefinition } from './types'

/** 校验并返回可渲染定义（日后可接远程加载、版本迁移） */
export function loadSimpleDefinition(raw: unknown): SimpleDefinition {
  if (!raw || typeof raw !== 'object') throw new Error('SimpleDefinition 无效')
  const d = raw as Partial<SimpleDefinition>
  if (d.mode !== 'simple') throw new Error('仅支持 mode=simple')
  if (!d.layers?.length) throw new Error('缺少 layers')
  if (!d.symbolMap || !d.blocks) throw new Error('缺少 symbolMap 或 blocks')
  return d as SimpleDefinition
}
