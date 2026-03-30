/**
 * 将「结构模型」与「方块注册表」合并为运行时定义。
 *
 * 数据流：
 *   SimpleModel（layers[c][b] 与 StructureLib addShape 一致 + symbolMap）+ block_registry.json → SimpleDefinition
 *
 * 方块表在构建时从 JSON 读入并浅拷贝进定义，避免 SimpleModel JSON 重复存放大块外观数据。
 */

import type { BlockRegistryData, SimpleDefinition, SimpleModel } from './types'

import blockRegistryJson from '@renderData/registries/block_registry.json'

const blockRegistry = blockRegistryJson as BlockRegistryData

export function mergeSimpleModel(model: SimpleModel): SimpleDefinition {
  return {
    schemaVersion: model.schemaVersion,
    mode: 'simple',
    id: model.id,
    layers: model.layers,
    symbolMap: model.symbolMap,
    blocks: { ...blockRegistry.blocks },
    initialCamera: model.initialCamera,
  }
}
