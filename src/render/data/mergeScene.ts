/**
 * 终态 StructureData 已自包含；恒等展开为 StructureDefinition。
 */

import type { StructureData, StructureDefinition } from '../schema/types'

export function mergeStructureData(model: StructureData): StructureDefinition {
  return { ...model }
}
