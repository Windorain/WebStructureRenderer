/**
 * 视口右上角世界坐标轴：与主相机朝向同步，用于对照 MC 世界轴（+Y 上、+X 东、+Z 南 等）。
 * 实现要点同 three.js `ViewHelper`：子物体 `quaternion = camera.quaternion⁻¹`，正交相机从 +Z 看向原点。
 */

import * as THREE from 'three'

const DEFAULT_SIZE_PX = 104
const FRUSTUM = 2.2

export class WorldAxesGizmo extends THREE.Object3D {
  private readonly ortho: THREE.OrthographicCamera

  private readonly viewportBackup = new THREE.Vector4()

  constructor(axisLength = 1.35) {
    super()
    this.name = 'WorldAxesGizmo'

    const axes = new THREE.AxesHelper(axisLength)
    axes.frustumCulled = false
    const mat = axes.material as THREE.LineBasicMaterial
    mat.depthTest = false
    axes.renderOrder = 999
    this.add(axes)

    this.ortho = new THREE.OrthographicCamera(-FRUSTUM, FRUSTUM, FRUSTUM, -FRUSTUM, 0.1, 8)
    this.ortho.position.set(0, 0, 3)
    this.ortho.lookAt(0, 0, 0)
  }

  /**
   * 在主场景 `render` 之后调用；临时关闭 `autoClear`（否则二次 render 会清屏），再 `clearDepth`、恢复 viewport。
   *
   * @param width height — 与 `renderer.getSize()` 一致（**CSS 像素**）。`getDrawingBufferSize` 会大 `pixelRatio` 倍，用于此处会把小窗推到画布外。
   */
  renderOverlay(
    renderer: THREE.WebGLRenderer,
    camera: THREE.Camera,
    width: number,
    height: number,
    sizePx: number = DEFAULT_SIZE_PX,
  ): void {
    const w = Math.max(width, 1)
    const h = Math.max(height, 1)
    const d = Math.max(32, Math.min(sizePx, Math.floor(Math.min(w, h) * 0.35)))

    this.quaternion.copy(camera.quaternion).invert()
    this.updateMatrixWorld(true)

    renderer.getViewport(this.viewportBackup)
    /** 第二次 render 若不清除 autoClear，会先清屏，主场景被抹掉，小窗里也看不到轴 */
    const prevAutoClear = renderer.autoClear
    renderer.autoClear = false
    renderer.clearDepth()

    const margin = 8
    const x = w - d - margin
    const y = h - d - margin

    renderer.setViewport(x, y, d, d)
    renderer.setScissor(x, y, d, d)
    renderer.setScissorTest(true)
    renderer.render(this, this.ortho)

    renderer.setScissorTest(false)
    renderer.autoClear = prevAutoClear
    renderer.setViewport(
      this.viewportBackup.x,
      this.viewportBackup.y,
      this.viewportBackup.z,
      this.viewportBackup.w,
    )
  }

  dispose(): void {
    const axes = this.children[0] as THREE.AxesHelper | undefined
    if (axes) {
      axes.geometry.dispose()
      ;(axes.material as THREE.Material).dispose()
    }
  }
}
