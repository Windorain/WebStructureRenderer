/**
 * 渲染前 prepare：由 PNG 首帧（竖条动画仅第一格）Alpha 推断 MaterialBlendMode。
 */

import * as THREE from 'three'

import { frameCountFromImageSize } from '../assets/textureStripAnimation'
import type { MaterialBlendMode } from '../schema/types'

const SAMPLE_STRIDE = 2
/** 视为全不透明 */
const ALPHA_OPAQUE_MIN = 250
/** 透明与中间态分界 */
const ALPHA_TRANSPARENT_MAX = 10
/** 中间态上界（低于 OPAQUE_MIN） */
const ALPHA_MID_MAX = 245
/** 中间 α 占比超过此值则判为 translucent */
const MID_RATIO_TRANSLUCENT = 0.008

function safeFrameCount(width: number, height: number): number {
  try {
    return frameCountFromImageSize(width, height)
  } catch {
    return 1
  }
}

function sampleFirstFrameToImageData(
  source: CanvasImageSource,
  width: number,
  height: number,
): ImageData | null {
  const frameH = Math.max(1, Math.floor(height / safeFrameCount(width, height)))
  const cw = Math.min(width, 512)
  const ch = Math.min(frameH, 512)
  const canvas = document.createElement('canvas')
  canvas.width = cw
  canvas.height = ch
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  try {
    ctx.drawImage(source, 0, 0, width, frameH, 0, 0, cw, ch)
    return ctx.getImageData(0, 0, cw, ch)
  } catch {
    return null
  }
}

function inferBlendFromImageData(data: ImageData): MaterialBlendMode {
  const { width, height, data: buf } = data
  let sampled = 0
  let mid = 0
  let nearTransparent = 0
  let opaqueHigh = 0

  for (let y = 0; y < height; y += SAMPLE_STRIDE) {
    for (let x = 0; x < width; x += SAMPLE_STRIDE) {
      const i = (y * width + x) * 4 + 3
      const a = buf[i] ?? 255
      sampled++
      if (a >= ALPHA_OPAQUE_MIN) opaqueHigh++
      else if (a <= ALPHA_TRANSPARENT_MAX) nearTransparent++
      else if (a < ALPHA_MID_MAX) mid++
    }
  }

  if (sampled === 0) return 'opaque'
  const midRatio = mid / sampled
  if (midRatio >= MID_RATIO_TRANSLUCENT) return 'translucent'
  if (nearTransparent === 0 && opaqueHigh === sampled) return 'opaque'
  return 'cutout'
}

/**
 * 由已加载的 Three纹理推断 blend；失败或无法读图时返回 `opaque`。
 */
export function inferBlendFromTexture(tex: THREE.Texture): MaterialBlendMode {
  const img = tex.image as HTMLImageElement | HTMLCanvasElement | ImageBitmap | undefined
  if (!img) return 'opaque'

  let w = 0
  let h = 0
  if ('naturalWidth' in img && img.naturalWidth > 0) {
    w = img.naturalWidth
    h = img.naturalHeight || ('naturalHeight' in img ? img.naturalHeight : 0)
  } else if ('width' in img && img.width > 0) {
    w = img.width
    h = img.height
  }
  if (w <= 0 || h <= 0) return 'opaque'

  const imageData = sampleFirstFrameToImageData(img as CanvasImageSource, w, h)
  if (!imageData) return 'opaque'
  return inferBlendFromImageData(imageData)
}
