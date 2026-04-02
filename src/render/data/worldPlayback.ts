/**
 * World 多帧：播放索引与内嵌 StructureData 解析（占位；`structureRef` 异步加载待接）。
 */

import type { Frame, StructureData, World } from '../schema/types'

/** 与磁盘 `world.json` 等约定的 schemaVersion 对齐 */
export const WORLD_DOCUMENT_SCHEMA_VERSION = 1 as const

/** 解析默认帧下标（含 loop 时对帧数取模） */
export function getDefaultFrameIndex(world: World): number {
  const n = world.frames.length
  if (n === 0) return 0
  const raw = world.playback?.defaultFrameIndex
  const i = raw === undefined || !Number.isFinite(raw) ? 0 : Math.floor(raw)
  if (world.playback?.loop) {
    return ((i % n) + n) % n
  }
  return Math.max(0, Math.min(n - 1, i))
}

export function frameAt(world: World, index: number): Frame | undefined {
  return world.frames[index]
}

export function embeddedStructure(frame: Frame | undefined): StructureData | undefined {
  return frame?.structure
}

/** 占位：按时间 tick 选帧；未实现 durationMs 时间轴时等价于 defaultFrameIndex */
export function frameIndexForPlaybackTick(
  world: World,
  frameIndexOverride: number | undefined,
  _timeMs: number,
): number {
  if (frameIndexOverride !== undefined && Number.isFinite(frameIndexOverride)) {
    const n = world.frames.length
    if (n === 0) return 0
    const i = Math.floor(frameIndexOverride)
    if (world.playback?.loop) return ((i % n) + n) % n
    return Math.max(0, Math.min(n - 1, i))
  }
  return getDefaultFrameIndex(world)
}
