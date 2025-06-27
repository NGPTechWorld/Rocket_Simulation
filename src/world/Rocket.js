import * as THREE from "three";

export default class Rocket {
  /**
   * @param {import('./WorldManager').default} world
   */
  constructor(world) {
    this.world = world;
    this.scene = world.scene;
    this.model = world.assetsLoader.getModels().rocket;
    this.gui = world.gui;
    this.groundLevel = 11;
    this.ascentSpeed = 2;

    this.setMesh();
  }

  setMesh() {
    this.model.position.set(10, this.groundLevel, 0);
    this.model.scale.set(4, 4, 4);
    this.scene.add(this.model);
  }

  get height() {
    const metersPerUnit = 1000;
    return (this.model.position.y - this.groundLevel) * metersPerUnit;
  }

  setGUI() {
    this.gui.addObjectControls("Rocket", this.model);
    this.gui.addTextMonitor("Rocket Height", () => this.height + " m");
    this.gui.addLaunchStopControls(this);
  }

  // launch() {
  //   if (this.isLaunching) return;

  //   this.isLaunching = true;

  //   const moveUp = () => {
  //     if (!this.isLaunching) return;

  //     this.model.position.y += this.ascentSpeed;

  //     requestAnimationFrame(moveUp);
  //   };
  //   this.startCameraShake()
  //   moveUp();
  // }

  launch() {
    if (this.isLaunching) return;
    this.isLaunching = true;
    // this.world.camera.switchMode('follow')

    this.world.assetsLoader.soundManager.play("launch");

    this.startCameraShake();

    this.launchStartTime = performance.now();

    const flash = new THREE.PointLight(0xffccaa, 100000, 100000);
    flash.position.copy(this.model.position);
    this.world.scene.add(flash);
    this.startLiftOff = false;
    setTimeout(() => {
      this.startLiftOff = true;
      this.liftStartTime = performance.now();
      this.world.scene.remove(flash);
    }, 3000);
  }

  update() {
    if (this.isLaunching) {
      const elapsed = (performance.now() - this.launchStartTime) / 1000;
      if (this.startLiftOff) {
      this.model.position.y += 0.5;
    }

      if (elapsed > 2) {
        this.stopCameraShake();
      }
    }
  }

  stop() {
    this.isLaunching = false;
  }

  startCameraShake() {
    this.originalCamPos = this.world.camera.instance.position.clone();
    this.shakeInterval = setInterval(() => {
      const cam = this.world.camera.instance;
      cam.position.x = this.originalCamPos.x + (Math.random() - 0.5) * 2.2;
      cam.position.y = this.originalCamPos.y + (Math.random() - 0.5) * 2.2;
      cam.position.z = this.originalCamPos.z + (Math.random() - 0.5) * 2.2;
    }, 30);
  }

  stopCameraShake() {
    clearInterval(this.shakeInterval);
    //this.world.camera.instance.position.copy(this.originalCamPos);
    //this.world.camera.switchMode('orbit')
  }
}
