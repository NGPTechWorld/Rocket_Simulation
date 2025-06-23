
export default class Rocket {
  constructor(world, model) {
    this.world=world
    this.scene = world.scene
    this.rocket = model
    this.setMesh()
  }

  setMesh() {
    this.rocket.position.set(0, 1, 0)
    this.rocket.scale.set(0.25, 0.25, 0.25)
    this.scene.add(this.rocket)
  }
}
