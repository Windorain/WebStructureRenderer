import type { InjectionKey } from 'vue'

import type { PreviewSceneStore } from '@/preview/previewSceneStore'

export const PreviewSceneContextKey: InjectionKey<PreviewSceneStore> =
  Symbol('PreviewSceneContext')
