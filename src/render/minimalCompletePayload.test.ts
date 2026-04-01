import { describe, expect, it } from 'vitest'

import electroStructure from '@renderData/structures/industrial_electrolyzer.simple.json'
import blockRegistryJson from '@renderData/registries/block_registry.json'
import materialRegistryJson from '@renderData/registries/material_registry.json'

import { mergeManyBlockRegistryLayers, sliceBlockRegistryByPalette } from '@/render/registrySlice'
import type { BlockRegistryData, MaterialRegistryData, StructureData } from '@/render/types'
import { loadStructureData, resolveFromMinimalCompletePayload } from '@/render/pipeline'

describe('resolveFromMinimalCompletePayload', () => {
  it('与 loadStructureData + 同一份 exportBlockRegistry 等价（无隐式全局表）', () => {
    const structure = electroStructure as StructureData
    const blockRegistry = blockRegistryJson as BlockRegistryData
    const materialRegistry = materialRegistryJson as MaterialRegistryData

    const viaLoad = loadStructureData(structure, { exportBlockRegistry: blockRegistry })
    const viaPayload = resolveFromMinimalCompletePayload({
      structure,
      blockRegistry,
      materialRegistry,
    })

    expect(viaPayload.definition).toEqual(viaLoad)
    expect(viaPayload.materialRegistry.schemaVersion).toBeGreaterThanOrEqual(materialRegistry.schemaVersion)
    expect(Object.keys(viaPayload.materialRegistry.materials).length).toBe(
      Object.keys(materialRegistry.materials).length,
    )
  })

  it('无全局底稿时省略 meshKind 的方块仍按 SimpleCube 合并（与 simpleMesh 一致）', () => {
    const structure = electroStructure as StructureData
    const blockRegistry = blockRegistryJson as BlockRegistryData
    const def = resolveFromMinimalCompletePayload({
      structure,
      blockRegistry,
      materialRegistry: materialRegistryJson as MaterialRegistryData,
    }).definition
    expect(def.blocks.casing_electrolyzer?.meshKind).toBe('SimpleCube')
    expect(def.blocks.controller?.meshKind).toBe('SimpleCube')
  })
})

describe('registrySlice', () => {
  it('sliceBlockRegistryByPalette 只保留 palette 相关键', () => {
    const structure: StructureData = {
      schemaVersion: 6,
      mode: 'voxelPalette',
      id: 'test',
      palette: [
        { registryId: 'air', meta: 0 },
        { registryId: 'foo', meta: 1 },
      ],
      cellGrid: [[[0, 1]]],
    }
    const global: BlockRegistryData = {
      schemaVersion: 1,
      blocks: {
        air: { faces: { all: { layers: [{ materialId: 'm:air', layerRole: 'base' }] } } },
        foo: { faces: {} },
        'foo@1': { faces: { all: { layers: [{ materialId: 'm:foo', layerRole: 'base' }] } } },
        unused: { faces: {} },
      },
    }
    const sliced = sliceBlockRegistryByPalette(structure, global)
    expect(sliced.blocks.unused).toBeUndefined()
    expect(sliced.blocks.air).toBeDefined()
    expect(sliced.blocks.foo).toBeDefined()
    expect(sliced.blocks['foo@1']).toBeDefined()
  })

  it('mergeManyBlockRegistryLayers 顺序合并', () => {
    const a: BlockRegistryData = { schemaVersion: 1, blocks: { x: { faces: {} } } }
    const b: BlockRegistryData = {
      schemaVersion: 1,
      blocks: {
        x: {
          faces: {
            all: {
              layers: [{ materialId: 'm', layerRole: 'base' }],
            },
          },
        },
      },
    }
    const m = mergeManyBlockRegistryLayers([a, b])
    expect(m.blocks.x?.faces?.all?.layers?.length).toBe(1)
  })
})
