import { Pinia } from 'pinia'
import { useLayerStore } from './layer'
import { useOverlayStore } from './overlay'
import { useRenderStore } from './render'

// 组件内使用不需要传pinia，组件外使用需要传pinia
export const viewerStore = {
  useLayerStore: (pinia?: Pinia) => useLayerStore(pinia),
  useOverlayStore: (pinia?: Pinia) => useOverlayStore(pinia),
  useRenderStore: (pinia?: Pinia) => useRenderStore(pinia)
}
