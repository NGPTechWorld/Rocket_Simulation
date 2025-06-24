
export default class Rocket {
  constructor(world, model) {
    this.world=world
    this.scene = world.scene
    this.model = model
    this.setMesh()
  }

  setMesh() {
    this.model.position.set(1, -4, 0)
    this.model.scale.set(0.3,0.3,0.3)
    this.scene.add(this.model)
  }
  setGUI() {
    this.world.gui.addObjectControls('Rocket',this.model)
  }
}
