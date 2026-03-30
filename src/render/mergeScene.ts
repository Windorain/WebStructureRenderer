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
  }
}
