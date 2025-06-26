import * as THREE from 'three'

export default class Renderer {
    /**
   * @param {import('./AppRun.js').default} app
   */
  constructor(app) {
    this.canvas = app.canvas
    this.scene = app.scene
    this.sizes = app.sizes
    this.camera = app.camera

    this.setInstance()
  }

  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    })
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(this.sizes.pixelRatio)
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(this.sizes.pixelRatio)
  }

  update() {
    this.instance.render(this.scene, this.camera.instance)
  }
}
