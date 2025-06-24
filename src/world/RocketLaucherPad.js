import GuiController from './ui/GuiController.js'

export default class RocketLaucherPad {
  constructor(world, model) {
    this.world=world
    this.scene = world.scene
    this.rocket_lancher = model
    this.setMesh()

  }

  setMesh() {
    this.rocket_lancher.position.set(0, -4.5, 0)
    this.rocket_lancher.scale.set(0.25, 0.25, 0.25)
    this.scene.add(this.rocket_lancher)
  }
  setGUI() {
    this.world.gui.addObjectControls('Rocket Laucher Pad',this.rocket_lancher)
  }
}
