import { describe, expect, it } from 'vitest'

import electroStructure from '@renderData/server/scenes/industrial_electrolyzer.simple/document.json'
import exportStructure from '@renderData/server/scenes/export/document.json'
import exportBlockRegistryJson from '@renderData/server/scenes/export/block_registry.json'
import exportMaterialRegistryJson from '@renderData/server/scenes/export/material_registry.json'
import blockRegistryJson from '@renderData/registries/block_registry.json'
import materialRegistryJson from '@renderData/registries/material_registry.json'

import { mergeManyBlockRegistryLayers, sliceBlockRegistryByPalette } from '@/render/registrySlice'
import { loadStructureData, resolveWikiRenderBundle } from '@/render/pipeline'
import type { BlockRegistryData, MaterialRegistryData, StructureData, World } from '@/render/types'

describe('resolveWikiRenderBundle', () => {
  it('与 loadStructureData + 同一份 blockRegistry 等价', () => {
    const structure = electroStructure as StructureData
    const blockRegistry = blockRegistryJson as BlockRegistryData
    const materialRegistry = materialRegistryJson as MaterialRegistryData

    const viaLoad = loadStructureData(structure, { blockRegistry })
    const viaBundle = resolveWikiRenderBundle({
      document: structure,
      blockRegistry,
      materialRegistry,
    })

    expect(viaBundle.definition).toEqual(viaLoad)
    expect(viaBundle.materialRegistry.schemaVersion).toBeGreaterThanOrEqual(materialRegistry.schemaVersion)
    expect(Object.keys(viaBundle.materialRegistry.materials).length).toBe(
      Object.keys(materialRegistry.materials).length,
    )
  })

  it('document 为 World 时与内嵌单结构等价', () => {
    const structure = electroStructure as StructureData
    const blockRegistry = blockRegistryJson as BlockRegistryData
    const materialRegistry = materialRegistryJson as MaterialRegistryData
    const world: World = {
      schemaVersion: 1,
      id: 'fixture.world',
      frames: [{ structure }],
    }
    const fromWorld = resolveWikiRenderBundle({
      document: world,
      blockRegistry,
      materialRegistry,
    })
    const fromStructure = resolveWikiRenderBundle({
      document: structure,
      blockRegistry,
      materialRegistry,
    })
    expect(fromWorld.definition).toEqual(fromStructure.definition)
  })

  it('StructureDataExporter 导出三件套（export.json + 同 stem 注册表）可装配', () => {
    const blockRegistry = exportBlockRegistryJson as BlockRegistryData
    const materialRegistry = exportMaterialRegistryJson as MaterialRegistryData
    const r = resolveWikiRenderBundle({
      document: exportStructure,
      blockRegistry,
      materialRegistry,
    })
    expect(r.definition.id).toBe('structuredata.exported')
    expect(r.definition.blocks['gregtech:gt.blockcasings@11']?.meshKind).toBe('SimpleCube')
    expect(r.definition.blocks['gregtech:gt.blockmachines@2']).toBeDefined()
  })

  it('definition.blocks 与 blockRegistry.blocks 条目引用一致（库内仅浅拷贝顶层表）', () => {
    const structure = electroStructure as StructureData
    const blockRegistry = blockRegistryJson as BlockRegistryData
    const def = resolveWikiRenderBundle({
      document: structure,
      blockRegistry,
      materialRegistry: materialRegistryJson as MaterialRegistryData,
    }).definition
    expect(def.blocks.casing_electrolyzer).toBe(blockRegistry.blocks.casing_electrolyzer)
    expect(def.blocks.controller).toBe(blockRegistry.blocks.controller)
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
