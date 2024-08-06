import { defineStore, acceptHMRUpdate } from 'pinia'
export const useOverlayStore = defineStore('overlay', {
  // a function that returns a fresh state
  state: () => ({
    mouseOverNameOpts: {
      position: [117.186419, 45.66446, 20],
      show: false,
      text: '',
      pixelOffset: [0, 0]
    }
  }),
  // optional getters
  getters: {},
  // optional actions
  actions: {
    setMouseOverlayLabel({ position, show, text, pixelOffset }) {
      this.mouseOverNameOpts.position = position
      this.mouseOverNameOpts.show = show
      this.mouseOverNameOpts.text = text
      this.mouseOverNameOpts.pixelOffset = pixelOffset
    },
    clearMouseOverlayLabel() {
      this.mouseOverNameOpts.position = undefined
      this.mouseOverNameOpts.show = false
      this.mouseOverNameOpts.text = undefined
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useOverlayStore, import.meta.hot))
}
