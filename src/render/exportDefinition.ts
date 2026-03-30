import type { SimpleDefinition, SimpleModel } from './types'

export function exportSimpleDefinitionJson(def: SimpleDefinition): string {
  return JSON.stringify(def, null, 2)
}

export function exportSimpleModelJson(model: SimpleModel): string {
  return JSON.stringify(model, null, 2)
}
