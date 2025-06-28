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
    this.guiRight = world.guiRight;
    this.guiLeft = world.guiLeft;
    this.groundLevel = 0;
    this.ground = -1;

    this.ascentSpeed = 2;
    this.isLaunching = false;
    this.isExplosion = false;
    this.isStartEngine = false;

    this.setMesh();
  }

  setMesh() {
    this.model.position.set(10, this.groundLevel, 0);
    this.model.scale.set(4, 4, 4);
    this.scene.add(this.model);
  }

  get height() {
    const metersPerUnit = 1;
    return (this.model.position.y - this.groundLevel) * metersPerUnit;
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

  setGUI() {
    const getPhysicsParameters = () =>
      this.world.physics.getPhysicsParameters();

    const getMagnitude = (vec) => {
      return Math.sqrt(vec[0] ** 2 + vec[1] ** 2 + vec[2] ** 2).toFixed(2);
    };

    this.guiRight.addObjectControls("Rocket", this.model);
    this.guiRight.addTextMonitor("Rocket Height", () => this.height + " m");
    this.guiRight.addLaunchStopControls(this);
    this.guiLeft.addTextMonitor("Time", () =>
      getPhysicsParameters().time.toFixed(2)
    );

    this.guiLeft.addVector3WithMagnitudeWithExtraMonitors(
      "Position",
      () => getPhysicsParameters().position,
      "m"
    );

    this.guiLeft.addVector3WithMagnitudeWithExtraMonitors(
      "Velocity",
      () => getPhysicsParameters().velocity,
      "m·s⁻¹"
    );

    this.guiLeft.addVector3WithMagnitudeWithExtraMonitors(
      "Acceleration",
      () => getPhysicsParameters().acceleration,
      "m·s⁻²"
    );

    this.guiLeft.addVector3WithMagnitudeWithExtraMonitors(
      "Weight Force",
      () => getPhysicsParameters().weight,
      "N"
    );

    this.guiLeft.addVector3WithMagnitudeWithExtraMonitors(
      "Drag Force",
      () => getPhysicsParameters().drag,
      "N"
    );

    this.guiLeft.addVector3WithMagnitudeWithExtraMonitors(
      "Lift Force",
      () => getPhysicsParameters().lift,
      "N"
    );

    this.guiLeft.addVector3WithMagnitudeWithExtraMonitors(
      "Thrust Force",
      () => getPhysicsParameters().thrust,
      "N"
    );

    this.guiLeft.addFuelProgressBar(
      "Fuel Level",
      () => getPhysicsParameters()["fuel mass"],
      () => getPhysicsParameters().initialFuelMass
    );

    // Mass
    this.guiLeft.addTextMonitor(
      "Total Mass",
      () => getPhysicsParameters()["total mass"].toFixed(2) + " kg"
    );
    this.guiLeft.addTextMonitor(
      "Fuel Mass",
      () => getPhysicsParameters()["fuel mass"].toFixed(2) + " kg"
    );

    // this.guiLeft.addVector3WithMagnitudeWithExtraMonitors(
    //   "Extra",
    //   () => getPhysicsParameters().thrust,
    //   "N", //  وحدة المتجه
    //   [
    //     {
    //       label: "Time",
    //       getValue: () => getPhysicsParameters().time,
    //     },
    //     {
    //       label: "Fuel Mass",
    //       getValue: () => getPhysicsParameters()["fuel mass"],
    //     },
    //   ]
    // );
  }

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

  startEngine() {
    if (this.isStartEngine) return;
    this.isStartEngine = true;

    this.world.physics.startEngine();
  }

  update() {
    if (this.isLaunching) {
      if (this.startLiftOff) {
        this.world.physics.update();
        //this.model.position.y += 0.5;
        console.log(this.world.physics.getPhysicsParameters());
        this.startEngine();
        this.model.position.x = this.world.physics.rocket.position.x / 100;
        this.model.position.y = this.world.physics.rocket.position.y / 100;
        this.model.position.z = this.world.physics.rocket.position.z / 100;
      }
    } else {
      if (this.model.position.y <= this.ground) {
        this.explosion();
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
