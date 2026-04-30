import { reactive } from 'vue'

export const wikiConfig = reactive({
  features: {
    titleBar: true,
    blockStatsSidebar: true,
    frameControls: true,
    layerBar: true,
    debugStatusBar: true,
  },
  viewWidth: 800,
  viewHeight: 600,
  projectionMode: 'orthographic' as 'orthographic' | 'perspective',
  sceneBackgroundHex: '#5a5a5a',
  iconSizePx: 128,
  iconOrthoHalf: 0.85,
})
