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

export default class WorldManager {
  /**
   * @param {import('./../core/AppRun.js').default} app
  */
  constructor(app) {
    this.scene = app.scene;
    this.gui = app.gui;
    this.textureLoader = new TextureLoader();
    this.modelLoader = new ModelLoader();

    this.init();

    // this.modelLoader.load(
    //   'rocket',
    //   '/models/rocket+laucher+pad.glb',
    //   this.scene,
    //   (model, animations) => {
    //     model.position.set(0, 0, 0)
    //     // لاحقًا فينا نستخدم animations
    //   }
    // )
  }

  async init() {
    // init Textuers
    const basePath = "/textures/";

    // await this.textureLoader.load(
    //   "grass",
    //   {
    //     map: basePath + "Grass003_1K-JPG_Color.jpg",
    //     normalMap: basePath + "Grass003_1K-JPG_NormalGL.jpg",
    //     roughnessMap: basePath + "Grass003_1K-JPG_Roughness.jpg",
    //     aoMap: basePath + "Grass003_1K-JPG_AmbientOcclusion.jpg",
    //   },
    //   {
    //     repeat: { x: 50, y: 50 }
    //   }
    // );
    // await this.sound.load(
    //   "explosion",
    //   "/sounds/explosion.mp3",
    //   false,
    //   1
    // );
    // this.sound.play("explosion");
    await this.textureLoader.load(
      "earth",
      {
        map: basePath + "earth_daymap.jpg",
      },
      {
        repeat: { x: 1, y: 1 },
      }
    );
    await this.textureLoader.load(
      "space",
      {
        map: basePath + "outer-space-background.jpg",
      },
      {
        repeat: { x: 1, y: 1 },
      }
    );

    // init Models
    const building = await this.modelLoader.load('house','models/build.glb')
    const apartment = await this.modelLoader.load('apartment','models/EEB_015.glb')
    const bunker = await this.modelLoader.load('bunker','models/Bunker.glb')
    const rocket_model = await this.modelLoader.load(
      "rocket",
      "/models/saturn_V_syria.glb"
    );
    const rocket_lancher = await this.modelLoader.load(
      "rocket_lancher",
      "/models/rocket_laucher_pad.glb"
    );
    const tree = await this.modelLoader.load("tree", "/models/birch_tree.glb");

    // World
    this.scene.background = this.textureLoader.get("space").map;
    this.earth = new Earth(this, this.textureLoader.get("earth"));
    this.rocket = new Rocket(this,rocket_model);
    this.rocket_lancher = new RocketLaucherPad(this,rocket_lancher);

    this.atmosphere = new AtmosphereLayer(this, '/textures/puresky.exr',996);
    this.atmosphereTracker = new AtmoshpereLayerTracker(this, this.rocket)

    this.ground = new Ground(this, this.textureLoader.get("grass"), tree, {
      radius: this.atmosphere.radius - 0.5,
      thickness: 0.5,
      color: 0x555555,
      positionY: -5.25
    });

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
      ...bunkerRow
    ]);

    // this.ground.buildings = this.buildings;

    this.setGUI();
    this.app.camera.followTarget(this.rocket.model); // rocket.model هو المجسم داخل كلاس Rocket
    console.log(this.app.camera.currentMode);
    this.gui.gui
      .add(this.app.camera, "currentMode", ["orbit", "first", "follow"])
      .name("Camera Mode");
  }

  update() {
    this.atmosphereTracker?.update();
  }
  setGUI() {
     this.rocket_lancher.setGUI()
     this.rocket.setGUI()
     this.atmosphere.setGUI()
     this.atmosphereTracker.setGUI()
    //  this.ground.setGUI()
  }
}
