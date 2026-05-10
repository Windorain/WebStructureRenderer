export interface WikiDiffEntry {
  path: string
  before: unknown
  after: unknown
}

export interface WikiEditSummaryResult {
  entries: WikiDiffEntry[]
  summary: string
  byteLength: number
  maxBytes: number
  tooLong: boolean
}

export const WIKI_EDIT_SUMMARY_MAX_BYTES = 500

const META_KEYS = ['id', 'label', 'author', 'gtnhVersion', 'structureId'] as const

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === 'object' && !Array.isArray(v)
}

function hasOwn(obj: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

function stableScalar(v: unknown): string {
  if (v === undefined) return '<missing>'
  return JSON.stringify(v)
}

function sameJsonValue(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

function addIfChanged(out: WikiDiffEntry[], path: string, before: unknown, after: unknown): void {
  if (sameJsonValue(before, after)) return
  out.push({ path, before, after })
}

function compareObjectKeys(
  out: WikiDiffEntry[],
  before: unknown,
  after: unknown,
  keys: readonly string[],
  prefix = '',
): void {
  const b = isRecord(before) ? before : {}
  const a = isRecord(after) ? after : {}
  for (const key of keys) {
    const path = prefix ? `${prefix}.${key}` : key
    addIfChanged(out, path, hasOwn(b, key) ? b[key] : undefined, hasOwn(a, key) ? a[key] : undefined)
  }
}

function compareExistingArrayItems(
  out: WikiDiffEntry[],
  before: unknown,
  after: unknown,
  path: string,
): Set<number> {
  const b = Array.isArray(before) ? before : []
  const a = Array.isArray(after) ? after : []
  const changed = new Set<number>()
  const n = Math.max(b.length, a.length)
  for (let i = 0; i < n; i++) {
    if (!sameJsonValue(b[i], a[i])) {
      addIfChanged(out, `${path}[${i}]`, b[i], a[i])
      changed.add(i)
    }
  }
  return changed
}

function gridIndexAt(grid: unknown, z: number, row: number, column: number): unknown {
  if (!Array.isArray(grid)) return undefined
  const zArr = grid[z]
  if (!Array.isArray(zArr)) return undefined
  const rArr = zArr[row]
  if (!Array.isArray(rArr)) return undefined
  return rArr[column]
}

function tooltipCellValue(palette: unknown, grid: unknown, z: number, row: number, column: number): unknown {
  const idx = gridIndexAt(grid, z, row, column)
  if (idx === undefined || idx === null) return ''
  if (typeof idx !== 'number' || !Number.isFinite(idx) || idx < 0) return ''
  if (!Array.isArray(palette)) return undefined
  return idx < palette.length ? palette[idx] : undefined
}

function compareTooltipGrid(
  out: WikiDiffEntry[],
  beforePalette: unknown,
  beforeGrid: unknown,
  afterPalette: unknown,
  afterGrid: unknown,
  path: string,
  paletteOnlyIndexes: ReadonlySet<number>,
): void {
  const bZ = Array.isArray(beforeGrid) ? beforeGrid : []
  const aZ = Array.isArray(afterGrid) ? afterGrid : []
  const zLen = Math.max(bZ.length, aZ.length)
  for (let z = 0; z < zLen; z++) {
    const bRows = Array.isArray(bZ[z]) ? bZ[z] as unknown[] : []
    const aRows = Array.isArray(aZ[z]) ? aZ[z] as unknown[] : []
    const rowLen = Math.max(bRows.length, aRows.length)
    for (let row = 0; row < rowLen; row++) {
      const bCols = Array.isArray(bRows[row]) ? bRows[row] as unknown[] : []
      const aCols = Array.isArray(aRows[row]) ? aRows[row] as unknown[] : []
      const colLen = Math.max(bCols.length, aCols.length)
      for (let column = 0; column < colLen; column++) {
        const beforeIdx = gridIndexAt(beforeGrid, z, row, column)
        const afterIdx = gridIndexAt(afterGrid, z, row, column)
        if (
          beforeIdx === afterIdx &&
          typeof beforeIdx === 'number' &&
          paletteOnlyIndexes.has(beforeIdx)
        ) {
          continue
        }
        addIfChanged(
          out,
          `${path}[${z}][${row}][${column}]`,
          tooltipCellValue(beforePalette, beforeGrid, z, row, column),
          tooltipCellValue(afterPalette, afterGrid, z, row, column),
        )
      }
    }
  }
}

function framesOf(doc: unknown): unknown[] {
  if (!isRecord(doc) || !Array.isArray(doc.frames)) return []
  return doc.frames
}

export function buildAuditedWikiDiff(before: unknown, after: unknown): WikiDiffEntry[] {
  const out: WikiDiffEntry[] = []
  compareObjectKeys(out, before, after, META_KEYS)

  const b = isRecord(before) ? before : {}
  const a = isRecord(after) ? after : {}
  const changedRootTooltipPaletteIndexes = compareExistingArrayItems(
    out,
    b.tooltipPalette,
    a.tooltipPalette,
    'tooltipPalette',
  )
  compareTooltipGrid(
    out,
    b.tooltipPalette,
    b.cellTooltipGrid,
    a.tooltipPalette,
    a.cellTooltipGrid,
    'cellTooltipGrid',
    changedRootTooltipPaletteIndexes,
  )

  const bFrames = framesOf(before)
  const aFrames = framesOf(after)
  const frameLen = Math.max(bFrames.length, aFrames.length)
  for (let i = 0; i < frameLen; i++) {
    const bFrame = (isRecord(bFrames[i]) ? bFrames[i] : {}) as Record<string, unknown>
    const aFrame = (isRecord(aFrames[i]) ? aFrames[i] : {}) as Record<string, unknown>
    const bStructure = isRecord(bFrame.structure) ? bFrame.structure : {}
    const aStructure = isRecord(aFrame.structure) ? aFrame.structure : {}
    compareTooltipGrid(
      out,
      b.tooltipPalette,
      bStructure.cellTooltipGrid,
      a.tooltipPalette,
      aStructure.cellTooltipGrid,
      `frames[${i}].structure.cellTooltipGrid`,
      changedRootTooltipPaletteIndexes,
    )
  }

  return out
}

export function buildWikiEditSummary(
  before: unknown,
  after: unknown,
  maxBytes = WIKI_EDIT_SUMMARY_MAX_BYTES,
): WikiEditSummaryResult {
  const entries = buildAuditedWikiDiff(before, after)
  const summary = entries.map(e => `${e.path}: ${stableScalar(e.before)} -> ${stableScalar(e.after)}`).join('; ')
  const byteLength = new TextEncoder().encode(summary).length
  return {
    entries,
    summary,
    byteLength,
    maxBytes,
    tooLong: byteLength > maxBytes,
  }
}
