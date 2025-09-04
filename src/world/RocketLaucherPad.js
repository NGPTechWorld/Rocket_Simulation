import GuiController from './ui/GuiController.js'

export default class RocketLaucherPad {
  /**
   * @param {import('./WorldManager').default} world
  */
  constructor(world) {
    this.scene = world.scene
    this.rocket_lancher = world.assetsLoader.getModels().rocket_lancher

 
    this.guiRight =world.guiRight
    this.setMesh()

  }

  setMesh() {
    this.rocket_lancher.position.set(-13.9, -10.4, 0)
    this.rocket_lancher.scale.set(3.5, 3.5, 3.5)
    this.scene.add(this.rocket_lancher)
  }
  setGUI() {
    this.guiRight.addObjectControls('Rocket Laucher Pad',this.rocket_lancher)
   
  }
}
