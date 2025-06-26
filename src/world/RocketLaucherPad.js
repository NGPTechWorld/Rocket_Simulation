import GuiController from './ui/GuiController.js'

export default class RocketLaucherPad {
  /**
   * @param {import('./WorldManager').default} world
  */
  constructor(world, model) {g
    this.scene = world.scene
    this.rocket_lancher = model
    this.setMesh()

  }

  setMesh() {
    this.rocket_lancher.position.set(-3.9, 2.2, 0)
    this.rocket_lancher.scale.set(3.5, 3.5, 3.5)
    this.scene.add(this.rocket_lancher)
  }
  setGUI() {
    this.world.gui.addObjectControls('Rocket Laucher Pad',this.rocket_lancher)
  }
}
