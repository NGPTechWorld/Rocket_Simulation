import * as THREE from "three";
import Earth from "./Earth.js";
import Rocket from "./Rocket.js";
import RocketLaucherPad from "./RocketLaucherPad.js";
import TextureLoader from "../core/TextureLoader.js";
import ModelLoader from "../core/ModelLoader.js";
import GuiController from "./ui/GuiController.js";
import AtmoshpereLayerTracker from "./AtmoshpereLayerTracker.js";
import SoundManager from "./../core/SoundManager.js";
import AtmosphereLayer from "./AtmoshpereLayer.js";
import Ground from "./Ground.js";
import BuildingPlacer from "./BuildingPlacer.js";
import RocketFire from "./effects/RocketFire.js";
import RocketSmoke from "./effects/RocketSmoke.js";
import Physics from "./../physics/Physics.js";
export default class WorldManager {
  /**
   * @param {import('./../core/AppRun.js').default} app
   */
  constructor(app) {
    this.assetsLoader = app.assetsLoader;
    this.scene = app.scene;
    this.camera = app.camera;
    this.guiRight = app.guiRight;
    this.guiLeft = app.guiLeft;
    this.textureLoader = new TextureLoader();
    this.modelLoader = new ModelLoader();
    this.physics = new Physics();
    this.init();
  }

  async init() {
    // this.scene.fog = new THREE.FogExp2(0x000000, 0.002); // أسود وضبابي

    // World
    this.scene.background = this.assetsLoader.getTextures()["space"].map;

    this.earth = new Earth(this);
    this.rocket = new Rocket(this);
    this.rocket_lancher = new RocketLaucherPad(this);
    this.atmosphere = new AtmosphereLayer(
      this,
      "/textures/puresky.exr",
      this.earth.radius - 15
    );
    this.atmosphereTracker = new AtmoshpereLayerTracker(this, this.rocket);

    const groundTextures = this.assetsLoader.getTextures()["ground"];
    this.ground = new Ground(this, groundTextures, {
      radius: this.atmosphere.radius - 0.5,
      thickness: 0.5,
      positionY: -5.25,
    });

    const building = this.assetsLoader.getModels().house;
    const apartment = this.assetsLoader.getModels().apartment;
    const bunker = this.assetsLoader.getModels().bunker;
    const city = this.assetsLoader.getModels().city;
    const desert2 = this.assetsLoader.getModels().desert2;
    // const brownstoneModel = this.assetsLoader.getModels().brownstone;
    //const brownstoneTextures = this.assetsLoader.getTextures().brownstone;

    // const brownstoneMaterial = createStandardBuildingMaterial(brownstoneTextures, this.renderer);

    // const brownstoneRow = Array.from({ length: 4 }, (_, i) => ({
    //   model: brownstoneModel.clone(),
    //   scale: [4, 4, 4],
    //   position: [i * 180 - 180, 0.1, -600],
    //   rotation: [0, Math.PI, 0],
    // }));

    // brownstoneRow.forEach((item) => {
    //   item.model.traverse((child) => {
    //     if (child.isMesh) {
    //       if (child.material) child.material.dispose(); // تنظيف
    //       child.material = brownstoneMaterial;
    //       child.castShadow = true;
    //       child.receiveShadow = true;
    //     }
    //   });
    // });

    const cityRow = Array.from({ length: 1 }, (_, i) => ({
      model: city,
      scale: [23, 23, 23],
      position: [-400 + i * 180, 0.3, 150],
      rotation: [0, -Math.PI, 0],
    }));
    const desertRow = Array.from({ length: 1 }, (_, i) => ({
      model: desert2,
      scale: [30, 30, 30],
      position: [-400 + i * 180, -50, -4000],
      rotation: [0, +Math.PI, 0],
    }));

    const buildingRow = Array.from({ length: 4 }, (_, i) => ({
      model: building,
      scale: [8, 8, 8],
      position: [i * 180 - 180, 0.1, -400],
      rotation: [0, -Math.PI / 2, 0],
    }));

    const apartmentRow = Array.from({ length: 4 }, (_, i) => ({
      model: apartment,
      scale: [5, 5, 5],
      position: [i * 180 - 180, 0.1, 400],
      rotation: [0, Math.PI, 0],
    }));

    const bunkerRow = Array.from({ length: 1 }, (_, i) => ({
      model: bunker,
      scale: [4, 4, 4],
      position: [400 - i * 180, 0.1, 0],
      rotation: [0, 0, 0],
    }));

    this.buildings = new BuildingPlacer(this, [
      // ...cityRow,
      // ...apartmentRow,
      // ...buildingRow,
      // ...bunkerRow,
      //...desertRow,
      // ...brownstoneRow
    ]);

    this.setGUI();
    this.camera.followTarget(this.rocket.model);
    this.rocketFire = new RocketFire(this, this.rocket.model);
    this.rocketSmoke = new RocketSmoke(this, this.rocket.model);
    
  }

  update() {
    this.atmosphereTracker?.update();
    this.rocketFire?.update();
    this.rocketSmoke?.update();
    this.rocket?.update();
    // this.buildings?.updateVisibleCities();
  }
  setGUI() {
    //this.rocket_lancher.setGUI()
    this.rocket.setGUI();
    this.atmosphere.setGUI();
    this.atmosphereTracker.setGUI();
    console.log(this.camera.currentMode);
    this.guiRight.gui
      .add(this.camera, "currentMode", ["orbit", "first", "follow"])
      .name("Camera Mode");
    const cameraInfo = {
      hint: "Press V",
    };

    this.guiRight.gui
      .add(cameraInfo, "hint")
      .name("📷 Change camera mode")
      .onFinishChange(() => {}); // حتى ما يصير editable
    //  this.ground.setGUI()
  }
}

// function createStandardBuildingMaterial(textures, renderer) {
//   const { map, normalMap, specularMap } = textures;

//   [map, normalMap, specularMap].forEach((tex) => {
//     if (tex) {
//       tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
//       tex.anisotropy = renderer.capabilities.getMaxAnisotropy?.() || 1;
//       tex.repeat.set(1, 1);
//     }
//   });

//   return new THREE.MeshPhongMaterial({
//     map,
//     normalMap,
//     specularMap,
//     shininess: 60,
//   });
// }
