import * as THREE from "three";
import ExplosionEffect from "./effects/ExplosionEffect.js";

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
    this.ground = 9;

    this.ascentSpeed = 2;
    this.isLaunching = false;
    this.isExplosion = false;
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
    }, 5000);
    setTimeout(() => {
      this.stopCameraShake();
    }, 6000);
  }

  explosion() {
    if (this.isExplosion) return;
    this.isExplosion = true;
    this.exploded = true;
    new ExplosionEffect(this.world, this.model.position);
    this.world.scene.remove(this.model);
  }
  update() {
    if (this.isLaunching) {
      if (this.startLiftOff) {
        this.model.position.y += 0.5;
        //  this.model.position.x = this.world.physics.rocket.position.x / 100
        // this.model.position.y = this.world.physics.rocket.position.y / 100
        // this.model.position.z = this.world.physics.rocket.position.z / 100
      }
    } else {
      if (this.model.position.y <= this.ground) {
        this.explosion()
      }
    }
  }

  stop() {
    this.isLaunching = false;
    this.world.assetsLoader.soundManager.stop("launch");
  }

  startCameraShake() {
    this.originalCamPos = this.world.camera.instance.position.clone();
    this.shakeInterval = setInterval(() => {
      const cam = this.world.camera.instance;
      cam.position.x = this.originalCamPos.x + (Math.random() - 0.5) * 4.2;
      cam.position.y = this.originalCamPos.y + (Math.random() - 0.5) * 4.2;
      cam.position.z = this.originalCamPos.z + (Math.random() - 0.5) * 4.2;
    }, 30);
  }

  stopCameraShake() {
    clearInterval(this.shakeInterval);
    //this.world.camera.instance.position.copy(this.originalCamPos);
    //this.world.camera.switchMode('orbit')
  }
}
