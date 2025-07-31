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
    this.model.position.set(0, this.groundLevel, 0);
    this.model.scale.set(4, 4, 4);
    this.scene.add(this.model);
  }

  get height() {
    const metersPerUnit = 1;
  //  const heightInMeters = (this.model.position.y - this.groundLevel) * metersPerUnit;
  //   return heightInMeters / 1000; 
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

    this.guiRight.addObjectControls("Rocket", this.model);
    this.guiRight.addTextMonitor("Rocket Height", () => this.height + " m");
    this.guiRight.addLaunchStopControls(this);
    this.guiLeft.addTextMonitor("Time", () =>
      getPhysicsParameters().time.toFixed(2)
    );

    this.guiLeft.addVector3WithMagnitudeWithExtraMonitors({
      label: "Position",
      getVectorFunc: () => getPhysicsParameters().position,
      unit: "m",
    });

    this.guiLeft.addVector3WithMagnitudeWithExtraMonitors({
      label: "Velocity",
      getVectorFunc: () => getPhysicsParameters().velocity,
      unit: "m·s⁻¹",
    });

    this.guiLeft.addVector3WithMagnitudeWithExtraMonitors({
      label: "Acceleration",
      getVectorFunc: () => getPhysicsParameters().acceleration,
      unit: "m·s⁻²",
    });

    this.guiLeft.addVector3WithMagnitudeWithExtraMonitors({
      label: "Total Force",
      getVectorFunc: () => getPhysicsParameters().totalForce,
      unit: "N",
    });
    this.guiLeft.addVector3WithMagnitudeWithExtraMonitors({
      label: "Weight Force",
      getVectorFunc: () => getPhysicsParameters().weight,
      unit: "N",
      extraMonitors: [
        {
          label: "Gravity Acceleration",
          getValue: () =>
            getPhysicsParameters().gravityAcceleration.toFixed(2) + " m/s²",
        },
        {
          label: "Weight Direction",
          getValue: () => {
            const dir = getPhysicsParameters().weightDirection;
            return `(${dir[0].toFixed(2)}, ${dir[1].toFixed(
              2
            )}, ${dir[2].toFixed(2)})`;
          },
        },
      ],
    });

    this.guiLeft.addVector3WithMagnitudeWithExtraMonitors({
      label: "Drag Force",
      getVectorFunc: () => getPhysicsParameters().drag,
      unit: "N",
      extraMonitors: [
        {
          label: "Drag Magnitude",
          getValue: () =>
            getPhysicsParameters().dragMagnitude.toFixed(2) + " N",
        },
        {
          label: "Drag Direction",
          getValue: () => {
            const dir = getPhysicsParameters().dragDirection;
            return `(${dir[0].toFixed(2)}, ${dir[1].toFixed(
              2
            )}, ${dir[2].toFixed(2)})`;
          },
        },
      ],
    });

    this.guiLeft.addVector3WithMagnitudeWithExtraMonitors({
      label: "Lift Force",
      getVectorFunc: () => getPhysicsParameters().lift,
      unit: "N",
      extraMonitors: [
        {
          label: "Lift Magnitude",
          getValue: () =>
            getPhysicsParameters().liftMagnitude.toFixed(2) + " N",
        },
        {
          label: "Lift Direction",
          getValue: () => {
            const dir = getPhysicsParameters().liftDirection;
            return `(${dir[0].toFixed(2)}, ${dir[1].toFixed(
              2
            )}, ${dir[2].toFixed(2)})`;
          },
        },
      ],
    });

    this.guiLeft.addVector3WithMagnitudeWithExtraMonitors({
      label: "Thrust Force",
      getVectorFunc: () => getPhysicsParameters().thrust,
      unit: "N",
      extraMonitors: [
        {
          label: "Ambient Pressure",
          getValue: () =>
            getPhysicsParameters().ambientPressure.toFixed(2) + " Pa",
        },
        {
          label: "Exhaust Velocity",
          getValue: () =>
            getPhysicsParameters().exhaustVelocity.toFixed(2) + " m/s",
        },
        {
          label: "Mass Flow Rate",
          getValue: () =>
            getPhysicsParameters().massFlowRate.toFixed(4) + " kg/s",
        },
        {
          label: "Chamber Pressure",
          getValue: () =>
            getPhysicsParameters().chamberPressure.toFixed(0) + " Pa",
        },
        {
          label: "Chamber Temp",
          getValue: () =>
            getPhysicsParameters().chamberTemperature.toFixed(2) + " K",
        },
      ],
    });

    this.guiLeft.addFuelProgressBar(
      "Fuel Level",
      () => getPhysicsParameters()["fuel mass"],
      () => getPhysicsParameters().initialFuelMass
    );

    this.guiLeft.addVector3WithMagnitudeWithExtraMonitors({
      label: "Rocket",
      // getVectorFunc: () => getPhysicsParameters().thrust,
      unit: "N",
      extraMonitors: [
        {
          label: "Fuel Type",
          getValue: () => getPhysicsParameters().fuelTypeName,
        },
        {
          label: "Fuel Mass",
          getValue: () => getPhysicsParameters()["fuel mass"] + " kg",
        },
        {
          label: "Total Mass",
          getValue: () =>
            getPhysicsParameters()["total mass"].toFixed(2) + " kg",
        },
        {
          label: "Dry Mass",
          getValue: () => getPhysicsParameters().dryMass + " kg",
        },
        {
          label: "Cross Section",
          getValue: () => getPhysicsParameters().crossSectionalArea + " m²",
        },
        {
          label: "Drag Coefficient",
          getValue: () => getPhysicsParameters().dragCoefficient,
        },
        {
          label: "Lift Coefficient",
          getValue: () => getPhysicsParameters().liftCoefficient,
        },
        {
          label: "Nozzle Count",
          getValue: () => getPhysicsParameters().nozzleCount,
        },
        {
          label: "Exit Area",
          getValue: () => getPhysicsParameters().exitArea + " m²",
        },
        {
          label: "Throat Area",
          getValue: () => getPhysicsParameters().A_throat + " m²",
        },
        {
          label: "Burn Duration",
          getValue: () => getPhysicsParameters().burnDuration.toFixed(2) + " s",
        },
      ],
    });

    this.guiLeft.addVector3WithMagnitudeWithExtraMonitors({
      label: "Environment",
      unit: "", // لا حاجة لوحدة عامة هنا
      extraMonitors: [
        {
          label: "Air Density",
          getValue: () =>
            getPhysicsParameters().airDensity.toFixed(4) + " kg/m³",
        },
        {
          label: "Sea-Level Pressure",
          getValue: () =>
            getPhysicsParameters().seaLevelPressure.toLocaleString() + " Pa",
        },
        {
          label: "Sea-Level Temperature",
          getValue: () => getPhysicsParameters().seaLevelTemperature + " K",
        },
        {
          label: "Gravity (g)",
          getValue: () =>
            getPhysicsParameters().gravitationalAcceleration + " m/s²",
        },
        {
          label: "Lapse Rate",
          getValue: () => getPhysicsParameters().temperatureLapseRate + " K/m",
        },
        {
          label: "Gas Constant (Air)",
          getValue: () =>
            getPhysicsParameters().specificGasConstantAir + " J/kg·K",
        },
      ],
    });

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
        // console.log(); this.world.physics.getPhysicsParameters()["fuel mass"]
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
    const stopMessage = document.getElementById('stop-message');
  if (stopMessage) {
    stopMessage.style.display = 'flex';

    // ربط زر إعادة المحاكاة (نزيل أي listener سابق لتجنب التكرار)
    const retryBtn = document.getElementById('retry-btn');
    if (retryBtn) {
      // إزالة أي مستمع موجود
      retryBtn.replaceWith(retryBtn.cloneNode(true));
      const freshBtn = document.getElementById('retry-btn');

      freshBtn.addEventListener('click', () => {
        // إخفاء الرسالة فوراً
        stopMessage.style.display = 'none';

        // إذا عندك دالة تعيد تهيئة المحاكاة، نستخدمها، وإلا نعيد تحميل الصفحة
        if (typeof initSimulation === 'function') {
          initSimulation();
        } else {
          location.reload();
        }
      });
    }
  }
  
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
