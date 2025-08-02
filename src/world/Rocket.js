import * as THREE from "three";
import ExplosionEffect from "./effects/ExplosionEffect.js";
import GUI from "lil-gui";
import GuiController from "./../world/ui/GuiController.js";
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
    this.groundLevel = 0.1;
    this.ground = -1;

    this.ascentSpeed = 2;
    this.isLaunching = false;
    this.isExplosion = false;
    this.isStartEngine = false;
    this.defaultSettings = {
      // Rocket
      fuelType: "RP-1/LOX",
      initialFuelMass: 2_640_000,
      dryMass: 330_000,
      A_throat: 0.25,
      crossSectionalArea: 10.1,
      dragCoefficient: 0.3,
      liftCoefficient: 0.05,
      nozzleCount: 5,
      exitArea: 3.8,
      burnDuration: 168,

      // Environment defaults
      airDensity: 1.225,
      seaLevelPressure: 101325,
      seaLevelTemperature: 288.15,
      gravitationalAcceleration: 9.80665,
      temperatureLapseRate: 0.0065,
      specificGasConstantAir: 287.05,

      deltaTime: 0.1,
    };
    this.userSettings = { ...this.defaultSettings };

    this.setMesh();
  }

  setMesh() {
    this.model.position.set(0, 1, 0);
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
  // resetGuiRightToDefaults() {
  //   this.userSettings = { ...this.defaultSettings };
  //   this.guiRight.gui.destroy();
  //   this.guiRight.gui = new GUI();
  //   this.guiRight = new GuiController(this.guiRight.gui);
  //   this.setGuiRight();
  // }

  //! Right GUI
  setGuiRight() {
    // Rocket
    const rocketFolder = this.guiRight.gui.addFolder("🚀 Rocket Values");
    rocketFolder
      .add(this.userSettings, "fuelType", ["RP-1/LOX", "LH2/LOX"])
      .name("Fuel Type");
    rocketFolder
      .add(this.userSettings, "initialFuelMass", 0, 5_000_000)
      .step(100)
      .name("Initial Fuel Mass");
    rocketFolder
      .add(this.userSettings, "dryMass", 0, 1_000_000)
      .step(100)
      .name("Rocket Dry Mass");
    rocketFolder
      .add(this.userSettings, "crossSectionalArea", 0, 100)
      .step(0.1)
      .name("Cross Sectional Area");
    rocketFolder
      .add(this.userSettings, "dragCoefficient", 0, 5)
      .step(0.1)
      .name("Drag Coefficient");
    rocketFolder
      .add(this.userSettings, "liftCoefficient", 0, 5)
      .step(0.01)
      .name("Lift Coefficient");
    rocketFolder
      .add(this.userSettings, "nozzleCount", 0, 10)
      .step(1)
      .name("Nozzle Count");
    rocketFolder
      .add(this.userSettings, "exitArea", 0, 100)
      .step(0.1)
      .name("Exit Area");
    rocketFolder
      .add(this.userSettings, "A_throat", 0, 10)
      .step(0.1)
      .name("Throat Area");
    // rocketFolder
    //   .add(this.userSettings, "burnDuration", 0, 10000)
    //   .step(10)
    //   .name("Burn Duration");

    // Enivronment
    const environmentFolder = this.guiRight.gui.addFolder(
      "🌍 Environment Values"
    );
    environmentFolder
      .add(this.userSettings, "airDensity", 0, 10)
      .step(0.001)
      .name("Air Density");
    environmentFolder
      .add(this.userSettings, "seaLevelPressure", 0, 200000)
      .step(100)
      .name("Sea-Level Pressure");
    environmentFolder
      .add(this.userSettings, "seaLevelTemperature", 0, 4000)
      .step(0.1)
      .name("Sea-Level Temp");
    environmentFolder
      .add(this.userSettings, "gravitationalAcceleration", 0, 200)
      .step(0.01)
      .name("Gravity");
    environmentFolder
      .add(this.userSettings, "temperatureLapseRate", 0, 1)
      .step(0.0001)
      .name("Temp Lapse Rate");
    environmentFolder
      .add(this.userSettings, "specificGasConstantAir", 0, 1000)
      .step(0.01)
      .name("Gas Constant");
    environmentFolder
      .add(this.userSettings, "deltaTime", 0, 1)
      .step(0.1)
      .name("Simulation Speed");

    this.guiRight.addLaunchStopControls(this);
    // rocketFolder
    //   .add({ reset: () => this.resetGuiRightToDefaults() }, "reset")
    //   .name("🔄 استعادة الإعدادات");
  }

  //! Left GUI
  setGuiLeft() {
    const getPhysicsParameters = () =>
      this.world.physics.getPhysicsParameters();

    this.guiLeft.addTextMonitor(
      "Rocket Height",
      () => this.height.toFixed(2) + " m"
    );
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
      () => getPhysicsParameters().fuelMass,
      () => getPhysicsParameters().initialFuelMass
    );

    this.guiLeft.addVector3WithMagnitudeWithExtraMonitors({
      label: "Rocket",
      unit: "N",
      extraMonitors: [
        {
          label: "Fuel Type",
          getValue: () => getPhysicsParameters().fuelTypeName,
        },
        {
          label: "Initial Fuel Mass",
          getValue: () =>
            getPhysicsParameters().initialFuelMass.toFixed(2) + " kg",
        },
        {
          label: "Now Fuel Mass",
          getValue: () => getPhysicsParameters().fuelMass.toFixed(2) + " kg",
        },
        {
          label: "Rocket Dry Mass",
          getValue: () => getPhysicsParameters().dryMass + " kg",
        },
        {
          label: "Total Mass",
          getValue: () => getPhysicsParameters().totalMass.toFixed(2) + " kg",
        },
        {
          label: "Cross Section Area",
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
        // {
        //   label: "Burn Duration",
        //   getValue: () => getPhysicsParameters().burnDuration.toFixed(2) + " s",
        // },
      ],
    });

    this.guiLeft.addVector3WithMagnitudeWithExtraMonitors({
      label: "Environment",
      unit: "",
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
          label: "Temp Lapse Rate",
          getValue: () => getPhysicsParameters().temperatureLapseRate + " K/m",
        },
        {
          label: "Gas Constant (Air)",
          getValue: () =>
            getPhysicsParameters().specificGasConstantAir + " J/kg·K",
        },
      ],
    });
  }

  launch() {
    if (this.isLaunching) return;
    this.isLaunching = true;
    // this.world.camera.switchMode('follow')
    this.applyUserSettings();
    // this.guiRight.gui.destroy();
    //!Effects
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
  applyUserSettings() {
    const settings = this.userSettings;
    this.world.physics.setPhysicsParameters({
      // Rocket
      dryMass: settings.dryMass,
      initialFuelMass: settings.initialFuelMass,
      A_throat: settings.A_throat,
      fuelType: settings.fuelType,
      crossSectionalArea: settings.crossSectionalArea,
      dragCoefficient: settings.dragCoefficient,
      liftCoefficient: settings.liftCoefficient,
      nozzleCount: settings.nozzleCount,
      exitArea: settings.exitArea,
      burnDuration: settings.burnDuration,

      // Environment parameters
      airDensity: settings.airDensity,
      seaLevelPressure: settings.seaLevelPressure,
      seaLevelTemperature: settings.seaLevelTemperature,
      gravitationalAcceleration: settings.gravitationalAcceleration,
      temperatureLapseRate: settings.temperatureLapseRate,
      specificGasConstantAir: settings.specificGasConstantAir,

      deltaTime: settings.deltaTime,
    });
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
        // console.log(); this.world.physics.getPhysicsParameters().fuelMass
        this.startEngine();
        this.model.position.x = this.world.physics.rocket.position.x / 1;
        this.model.position.y = this.world.physics.rocket.position.y / 1;
        this.model.position.z = this.world.physics.rocket.position.z / 1;
        if (this.model.position.y < this.groundLevel) {
          this.explosion();
        }
      }
    } else {
      if (this.model.position.y < this.groundLevel) {
        this.explosion();
      }
    }
  }

  stop() {
    this.isLaunching = false;
    const stopMessage = document.getElementById("stop-message");
    if (stopMessage) {
      stopMessage.style.display = "flex";

      // ربط زر إعادة المحاكاة (نزيل أي listener سابق لتجنب التكرار)
      const retryBtn = document.getElementById("retry-btn");
      if (retryBtn) {
        // إزالة أي مستمع موجود
        retryBtn.replaceWith(retryBtn.cloneNode(true));
        const freshBtn = document.getElementById("retry-btn");

        freshBtn.addEventListener("click", () => {
          // إخفاء الرسالة فوراً
          stopMessage.style.display = "none";

          // إذا عندك دالة تعيد تهيئة المحاكاة، نستخدمها، وإلا نعيد تحميل الصفحة
          if (typeof initSimulation === "function") {
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
