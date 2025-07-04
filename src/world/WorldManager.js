import * as THREE from 'three'
import Earth from "./Earth.js";
import Rocket from "./Rocket.js";
import RocketLaucherPad from "./RocketLaucherPad.js";
import TextureLoader from "../core/TextureLoader.js";
import ModelLoader from "../core/ModelLoader.js";
import GuiController from './ui/GuiController.js'
import AtmoshpereLayerTracker from "./AtmoshpereLayerTracker.js";
import SoundManager from "./../core/SoundManager.js";
import AtmosphereLayer from "./AtmoshpereLayer.js";
import Ground from "./Ground.js";
import BuildingPlacer from "./BuildingPlacer.js";
import RocketFire from './effects/RocketFire.js'
import RocketSmoke from './effects/RocketSmoke.js'
import Physics from './../physics/Physics.js'
export default class WorldManager {
  /**
   * @param {import('./../core/AppRun.js').default} app
   */
  constructor(app) {
    this.assetsLoader=app.assetsLoader
    this.scene = app.scene;
    this.camera=app.camera
    this.guiRight = app.guiRight;
    this.guiLeft= app.guiLeft
    this.textureLoader = new TextureLoader();
    this.modelLoader = new ModelLoader();
    
    // this.physics= app.physics
    this.physics =new Physics();
    this.init();
  }

  async init() {
    // this.scene.fog = new THREE.FogExp2(0x000000, 0.002); // أسود وضبابي

    // World
    this.scene.background = this.assetsLoader.getTextures()['space'].map;
    this.earth = new Earth(this);
    this.rocket = new Rocket(this);
    this.rocket_lancher = new RocketLaucherPad(this);

    this.atmosphere = new AtmosphereLayer(this, '/textures/puresky.exr',996);
    this.atmosphereTracker = new AtmoshpereLayerTracker(this, this.rocket)

    const groundTextures = this.assetsLoader.getTextures()["ground"];
    this.ground = new Ground(this,groundTextures,this.assetsLoader.getModels().tree,{
      radius: this.atmosphere.radius - 0.5,
      thickness: 0.5,
      // color: 0x555555,
      positionY: -5.25     
    })
    const building =this.assetsLoader.getModels().house;
    const apartment =this.assetsLoader.getModels().apartment;
    const bunker =this.assetsLoader.getModels().bunker;
    const city = this.assetsLoader.getModels().city;

    const cityRow = Array.from({ length: 1 }, (_, i) => ({
      model: city,
      scale: [20,20, 20],
      position: [-400 + i * 180, 0.3, 150],
      rotation: [0, - Math.PI , 0], 
    }));

    const buildingRow = Array.from({ length: 4 }, (_, i) => ({
      model: building,
      scale: [8,8, 8],
      position: [i * 180 - 180, 0.1, -400],
      rotation: [0, -Math.PI / 2, 0], 
    }));
    
    const apartmentRow = Array.from({ length: 4 }, (_, i) => ({
      model: apartment,
      scale: [5, 5, 5],
      position: [i * 180 - 180, 0.1, 400], 
      rotation: [0, Math.PI, 0],
    }));

    const bunkerRow = Array.from({ length: 2 }, (_, i) => ({
      model: bunker,
      scale: [4,4, 4],               
      position: [450, 0.1, i * 180 - 40],     
      rotation: [0, 0, 0],         
    }));
    
    this.buildings = new BuildingPlacer(this, [
      ...buildingRow,
      ...apartmentRow,
      ...bunkerRow,
      ...cityRow
    ]);

    // this.ground.buildings = this.buildings;

    this.setGUI();
    this.camera.followTarget(this.rocket.model); 
    this.rocketFire = new RocketFire(this, this.rocket.model)
    this.rocketSmoke = new RocketSmoke(this, this.rocket.model)
    console.log(this.camera.currentMode);
    this.guiRight.gui
      .add(this.camera, "currentMode", ["orbit", "first", "follow"])
      .name("Camera Mode");
  }

  update() {
    this.atmosphereTracker?.update();
    this.rocketFire?.update()
    this.rocketSmoke?.update()
    this.rocket?.update()

  }
  setGUI() {
    // this.rocket_lancher.setGUI()
    this.rocket.setGUI()
    this.atmosphere.setGUI()
    this.atmosphereTracker.setGUI()
    //  this.ground.setGUI()
  }
}
