/**
 * 合并层：StructureData + block_registry → StructureDefinition（外观表来自全局注册表，非 Three）。
 */

import type { BlockRegistryData, StructureData, StructureDefinition } from './types'

import blockRegistryJson from '@renderData/registries/block_registry.json'

const blockRegistry = blockRegistryJson as BlockRegistryData

export function mergeStructureData(model: StructureData): StructureDefinition {
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
