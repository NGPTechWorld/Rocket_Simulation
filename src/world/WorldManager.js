import Earth from './Earth.js'
import Rocket from './Rocket.js'

export default class WorldManager {
  constructor(app) {
    this.app = app
    this.scene = app.scene

    // إنشاء المجسمات
    this.earth = new Earth(this.scene)
    this.rocket = new Rocket(this.scene)
  }

  update() {
    // لاحقًا ممكن نحرك الصاروخ هون
  }
}
