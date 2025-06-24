
export default class Rocket {
  constructor(world, model) {
    this.world=world
    this.scene = world.scene
    this.model = model
    this.setMesh()
  }

  setMesh() {
    this.model.position.set(0, 1, 0)
    this.model.scale.set(0.25, 0.25, 0.25)
    this.scene.add(this.model)
  }
}
