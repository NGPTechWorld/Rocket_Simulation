export default class Rocket {
  constructor(world, model) {
    this.world=world
    this.scene = world.scene
    this.model = model

    this.groundLevel = -4.25
    this.ascentSpeed = 2
    this.setMesh()
  }

  setMesh() {
    this.model.position.set(1, this.groundLevel, 0)
    this.model.scale.set(0.3,0.3,0.3)
    this.scene.add(this.model)
  }

  get height () {
    const metersPerUnit = 1000;
    return (this.model.position.y - this.groundLevel) * metersPerUnit;
  }

  setGUI() {
    this.world.gui.addObjectControls('Rocket',this.model)
    this.world.gui.addTextMonitor('Rocket Height', () => this.height + ' m')
    this.world.gui.addLaunchStopControls(this)
  }

  launch() {
    if (this.isLaunching) return;

    this.isLaunching = true;

    const moveUp = () => {
      if (!this.isLaunching) return;

      this.model.position.y += this.ascentSpeed;

      requestAnimationFrame(moveUp);
    };

    moveUp();
  }

  stop() {
    this.isLaunching = false;
  }
}
