
export default class Rocket {
  constructor(scene, model) {
    this.scene = scene
    this.rocket = model
    this.setMesh()
  }

  setMesh() {
    this.rocket.position.set(0, 0, 0)
    this.rocket.scale.set(0.25, 0.25, 0.25)
    this.scene.add(this.rocket)
  }
}
