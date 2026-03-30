/**
 * 合并层：SimpleModel + block_registry → SimpleDefinition（外观表来自全局注册表，非 Three）。
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
