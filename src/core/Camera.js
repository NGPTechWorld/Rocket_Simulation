import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera {
  constructor(app) {
    this.app = app
    this.sizes = app.sizes
    this.scene = app.scene
    this.canvas = app.canvas

    this.setInstance()
    this.setControls()
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      75,
      this.sizes.width / this.sizes.height,
      0.1,
      1000
    )
    this.instance.position.set(0, 2, 10)
    this.scene.add(this.instance)
  }

  setControls() {
    this.controls = new OrbitControls(this.instance, this.canvas)
    this.controls.enableDamping = true  // سلاسة بالحركة
    this.controls.enablePan = true      // تفعيل تحريك المشهد
    this.controls.enableZoom = true     // تكبير وتصغير
    this.controls.target.set(0, 1, 0)    // تركيز الكاميرا على مركز الصاروخ
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height
    this.instance.updateProjectionMatrix()
  }

  update() {
    this.controls.update()
  }
}
