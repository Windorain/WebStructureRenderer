/**
 * Minecraft Java 版方块模型（block model）面 UV 与 Three.js 网格 UV 的对应关系。
 *
 * 官方/规范依据（注释中简称「Wiki」均指 Minecraft Wiki 英文站）：
 * - Block states / Model：面名 north、south、east、west、up、down 与世界轴的对应
 *   https://minecraft.wiki/w/Block_states
 * - Model 格式：`faces` 中 `uv` 为纹理图上的像素矩形，原点为纹理左上角，u 向右、v 向下
 *   https://minecraft.wiki/w/Models#Block_models
 *
 * Three.js `Texture` 默认 `flipY === true`（OpenGL 常见约定）：UV 中 v=0 对应纹理图像底行，v=1 对应顶行。
 * 本项目的几何 UV 均按「Minecraft 纹理空间 (u_mc, v_mc)，v_mc=0 为 PNG 顶行」换算到 Three：
 *   u_three = u_mc
 *   v_three = 1 - v_mc
 *
 * 与 `simpleMesh.ts` 中 `quadGeometryForFace` 的顶点顺序 q0→q1→q2→q3 一一对应（每面从外侧看为逆时针，与 Three 正面一致）。
 */

import type { FaceName } from './types'

/** 与 quadGeometryForFace 中各面 q0..q3 顺序一致的 8 个分量：u0,v0,u1,v1,u2,v2,u3,v3（Three.js UV，且假定纹理 flipY=true） */
export function uv8ForFace(face: FaceName): Float32Array {
  switch (face) {
    case '-z':
      // North：外侧从 +Z 看向 -Z；纹理 u 西→东，v 上→下（Wiki：north 面 UV 语义）
      return new Float32Array([0, 1, 1, 1, 1, 0, 0, 0])
    case '+z':
      // South：外侧从 -Z 看向 +Z；与 north 相对，水平镜像以匹配 MC 默认 south 面贴图方向
      return new Float32Array([0, 0, 1, 0, 1, 1, 0, 1])
    case '+x':
      // East：外侧从 +X 看向 -X；纹理 u 北(-Z)→南(+Z)，v 上→下
      return new Float32Array([0, 0, 0, 1, 1, 1, 1, 0])
    case '-x':
      // West：外侧从 -X 看向 +X；u 南→北（与 east 镜像）
      return new Float32Array([0, 0, 0, 1, 1, 1, 1, 0])
    case '+y':
      // Up：从 +Y 俯视；MC 默认 u 西→东，v 北(-Z)→南(+Z)（Wiki block model 顶面约定）
      return new Float32Array([0, 1, 0, 0, 1, 0, 1, 1])
    case '-y':
      // Down：从 -Y 仰视；Java 版未旋转时 down 面相对 up 在 UV 平面上常视为 180°（与 Wiki 中 face 默认朝向一致）
      return new Float32Array([1, 0, 0, 0, 0, 1, 1, 1])
    default:
      throw new Error(`unknown face: ${String(face)}`)
  }
}
