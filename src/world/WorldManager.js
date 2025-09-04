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
    this.guiRight.gui.domElement.style.zIndex = "10";
    this.guiRight.gui.domElement.style.position = "absolute";

    this.guiLeft.gui.domElement.style.zIndex = "10";
    this.guiLeft.gui.domElement.style.position = "absolute";
    this.textureLoader = new TextureLoader();
    this.modelLoader = new ModelLoader();
    this.physics = new Physics();
    this.init();
  }

  async init() {

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

    // const bunker = this.assetsLoader.getModels().bunker;

    // const bunkerRow = Array.from({ length: 1 }, (_, i) => ({
    //   model: bunker,
    //   scale: [4, 4, 4],
    //   position: [400 - i * 180, 0.1, 0],
    //   rotation: [0, 0, 0],
    // }));

    // this.buildings = new BuildingPlacer(this, [...bunkerRow]);

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
  }
  //!Osama here
  setGUI() {
    this.rocket.setGuiRight();
    this.rocket.setGuiLeft();
    this.atmosphere.setGUI();
    this.atmosphereTracker.setGUI();
    this.guiRight.gui
      .add(this.camera, "currentMode", ["orbit", "first", "follow"])
      .name("Camera Mode");
    const cameraInfo = {
      hint: "Press V",
    };

    this.guiRight.gui
      .add(cameraInfo, "hint")
      .name("📷 Change camera mode")
      .onFinishChange(() => {});
  }
}
