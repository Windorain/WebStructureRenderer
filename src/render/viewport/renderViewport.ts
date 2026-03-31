/**
 * 视口：WebGLRenderer + 透视/正交双相机 + OrbitControls，单一入口处理投影切换与尺寸。
 * 与场景内容、材质库解耦，仅持有渲染与相机状态。
 */

import * as THREE from 'three'
import { MOUSE } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { WorldAxesGizmo } from './worldAxesGizmo'

export type ProjectionMode = 'perspective' | 'orthographic'

const DEFAULT_FRUSTUM_SIZE = 10

export interface RenderViewportOptions {
  /** 挂载 canvas 的容器（内部会 append renderer.domElement） */
  container: HTMLElement
  width: number
  height: number
}

export class RenderViewport {
  readonly renderer: THREE.WebGLRenderer

  readonly perspectiveCamera: THREE.PerspectiveCamera

  readonly orthographicCamera: THREE.OrthographicCamera

  readonly controls: OrbitControls

  private _mode: ProjectionMode

  private readonly container: HTMLElement

  private readonly worldAxesGizmo = new WorldAxesGizmo()

  /** `setViewport` / `setScissor` 使用 CSS 像素；勿用 `getDrawingBufferSize`（会乘 pixelRatio，导致小窗画到画布外） */
  private readonly rendererCssSize = new THREE.Vector2()

  constructor(options: RenderViewportOptions) {
    this.container = options.container
    const w = Math.max(options.width, 1)
    const h = Math.max(options.height, 1)
    const aspect = w / h

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(w, h)
    this.renderer.outputColorSpace = THREE.SRGBColorSpace

    this.perspectiveCamera = new THREE.PerspectiveCamera(50, aspect, 0.1, 500)

    const fs = DEFAULT_FRUSTUM_SIZE
    this.orthographicCamera = new THREE.OrthographicCamera(
      (-fs * aspect) / 2,
      (fs * aspect) / 2,
      fs / 2,
      -fs / 2,
      0.1,
      500,
    )

    this._mode = 'perspective'
    this.controls = new OrbitControls(this.perspectiveCamera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.08
    this.controls.rotateSpeed = 0.9
    /** 中键拖动平移轨道目标（相机对准中心），默认中键为缩放 DOLLY，此处改为 PAN */
    this.controls.enablePan = true
    this.controls.mouseButtons = {
      LEFT: MOUSE.ROTATE,
      MIDDLE: MOUSE.PAN,
      RIGHT: MOUSE.DOLLY,
    }

    const el = this.renderer.domElement
    /**
     * Windows 等环境下中键会启动浏览器「滚动模式」并伴随额外 wheel/合成事件；
     * 释放后 `OrbitControls` 在 `state === NONE` 时处理 wheel 会误判为缩放，相机沿视线突进。
     * 阻止中键默认行为，保留中键平移（与 OrbitControls 的 pointer 监听不冲突）。
     */
    el.addEventListener(
      'pointerdown',
      (e: PointerEvent) => {
        if (e.button === 1) e.preventDefault()
      },
      { capture: true },
    )

    options.container.appendChild(el)
  }

  get mode(): ProjectionMode {
    return this._mode
  }

  get activeCamera(): THREE.Camera {
    return this._mode === 'perspective' ? this.perspectiveCamera : this.orthographicCamera
  }

  /**
   * 将正交相机与当前透视相机对齐（位置、朝向、up），在 applyInitialCamera(透视) 之后调用一次。
   */
  syncOrthographicFromPerspective(): void {
    const p = this.perspectiveCamera
    const o = this.orthographicCamera
    o.position.copy(p.position)
    o.quaternion.copy(p.quaternion)
    o.up.copy(p.up)
    o.updateProjectionMatrix()
  }

  setMode(mode: ProjectionMode): void {
    if (mode === this._mode) return

    const prev = this.activeCamera
    this._mode = mode
    const next = this.activeCamera

    next.position.copy(prev.position)
    next.quaternion.copy(prev.quaternion)
    next.up.copy(prev.up)
    if (next instanceof THREE.PerspectiveCamera || next instanceof THREE.OrthographicCamera) {
      next.updateProjectionMatrix()
    }

    this.controls.object = next
    this.controls.update()
  }

  toggleMode(): ProjectionMode {
    const next = this._mode === 'perspective' ? 'orthographic' : 'perspective'
    this.setMode(next)
    return this._mode
  }

  resize(width: number, height: number): void {
    const w = Math.max(width, 1)
    const h = Math.max(height, 1)
    const aspect = w / h

    const p = this.perspectiveCamera
    p.aspect = aspect
    p.updateProjectionMatrix()

    const fs = DEFAULT_FRUSTUM_SIZE
    const o = this.orthographicCamera
    o.left = (-fs * aspect) / 2
    o.right = (fs * aspect) / 2
    o.top = fs / 2
    o.bottom = -fs / 2
    o.updateProjectionMatrix()

    this.renderer.setSize(w, h)
  }

  render(scene: THREE.Scene): void {
    this.renderer.render(scene, this.activeCamera)
    this.renderer.getSize(this.rendererCssSize)
    this.worldAxesGizmo.renderOverlay(
      this.renderer,
      this.activeCamera,
      this.rendererCssSize.x,
      this.rendererCssSize.y,
    )
  }

  dispose(): void {
    this.worldAxesGizmo.dispose()
    this.controls.dispose()
    this.renderer.dispose()
    const el = this.renderer.domElement
    if (el.parentNode === this.container) {
      this.container.removeChild(el)
    }
  }
}
