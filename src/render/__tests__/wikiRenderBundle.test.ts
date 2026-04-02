import { describe, expect, it } from 'vitest'

import electroStructure from '@renderData/scenes/industrial_electrolyzer.simple.json'
import exportStructure from '@renderData/scenes/export.json'
import blockRegistryJson from '@renderData/registries/block_registry.json'
import materialRegistryJson from '@renderData/registries/material_registry.json'
import modelRegistryJson from '@renderData/registries/model_registry.json'

import { mergeManyBlockRegistryLayers, sliceBlockRegistryByPalette } from '@/render/data/registrySlice'
import { loadStructureData, resolveRenderBundle } from '@/render/data/bundleResolve'
import type { BlockRegistryData, MaterialRegistryData, ModelRegistryData, StructureData, World } from '@/render/schema/types'

describe('resolveRenderBundle', () => {
  it('与 loadStructureData + 同一份 blockRegistry 等价', () => {
    const structure = electroStructure as StructureData
    const blockRegistry = blockRegistryJson as BlockRegistryData
    const materialRegistry = materialRegistryJson as MaterialRegistryData
    const modelRegistry = modelRegistryJson as unknown as ModelRegistryData

    const viaLoad = loadStructureData(structure, { blockRegistry, modelRegistry })
    const viaBundle = resolveRenderBundle({
      document: structure,
      blockRegistry,
      materialRegistry,
      modelRegistry,
    })

    expect(viaBundle.definition).toEqual(viaLoad)
    expect(Object.keys(viaBundle.materialRegistry.materials).length).toBe(
      Object.keys(materialRegistry.materials).length,
    )
  })

  it('document 为 World 时与内嵌单结构等价', () => {
    const structure = electroStructure as StructureData
    const blockRegistry = blockRegistryJson as BlockRegistryData
    const materialRegistry = materialRegistryJson as MaterialRegistryData
    const modelRegistry = modelRegistryJson as unknown as ModelRegistryData
    const world: World = {
      id: 'fixture.world',
      frames: [{ structure }],
    }
    const fromWorld = resolveRenderBundle({
      document: world,
      blockRegistry,
      materialRegistry,
      modelRegistry,
    })
    const fromStructure = resolveRenderBundle({
      document: structure,
      blockRegistry,
      materialRegistry,
      modelRegistry,
    })
    expect(fromWorld.definition).toEqual(fromStructure.definition)
  })

  it('export 场景单文件 + data/registries 可装配', () => {
    const blockRegistry = blockRegistryJson as BlockRegistryData
    const materialRegistry = materialRegistryJson as MaterialRegistryData
    const modelRegistry = modelRegistryJson as unknown as ModelRegistryData
    const r = resolveRenderBundle({
      document: exportStructure,
      blockRegistry,
      materialRegistry,
      modelRegistry,
    })
    expect(r.definition.id).toBe('structuredata.exported')
    expect(r.definition.palette.length).toBeGreaterThan(1)
  })

  it('definition.blocks 与 blockRegistry.blocks 条目引用一致（库内仅浅拷贝顶层表）', () => {
    const structure = electroStructure as StructureData
    const blockRegistry = blockRegistryJson as BlockRegistryData
    const def = resolveRenderBundle({
      document: structure,
      blockRegistry,
      materialRegistry: materialRegistryJson as MaterialRegistryData,
      modelRegistry: modelRegistryJson as unknown as ModelRegistryData,
    }).definition
    expect(def.blocks.casing_electrolyzer).toBe(blockRegistry.blocks.casing_electrolyzer)
    expect(def.blocks.controller).toBe(blockRegistry.blocks.controller)
  })
})

describe('registrySlice', () => {
  it('sliceBlockRegistryByPalette 只保留 palette 相关键', () => {
    const structure: StructureData = {
      mode: 'voxelPalette',
      id: 'test',
      palette: [
        { registryId: 'air', meta: 0 },
        { registryId: 'foo', meta: 1 },
      ],
      cellGrid: [[[0, 1]]],
    }
    const global: BlockRegistryData = {
      blocks: {
        air: {
          meshKind: 'SimpleCube',
          faces: { all: { layers: [{ materialId: 'm:air', layerRole: 'base' }] } },
        },
        foo: { meshKind: 'Unknown', faces: {} },
        'foo@1': {
          meshKind: 'SimpleCube',
          faces: { all: { layers: [{ materialId: 'm:foo', layerRole: 'base' }] } },
        },
        unused: { meshKind: 'Unknown', faces: {} },
      },
    }
    const sliced = sliceBlockRegistryByPalette(structure, global)
    expect(sliced.blocks.unused).toBeUndefined()
    expect(sliced.blocks.air).toBeDefined()
    expect(sliced.blocks.foo).toBeDefined()
    expect(sliced.blocks['foo@1']).toBeDefined()
  })

  it('mergeManyBlockRegistryLayers 顺序合并', () => {
    const a: BlockRegistryData = { blocks: { x: { meshKind: 'SimpleCube', faces: {} } } }
    const b: BlockRegistryData = {
      blocks: {
        x: {
          meshKind: 'SimpleCube',
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
