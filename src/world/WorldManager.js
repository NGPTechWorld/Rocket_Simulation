import Earth from "./Earth.js";
import Rocket from "./Rocket.js";
import RocketLaucherPad from "./RocketLaucherPad.js";
import TextureLoader from "../core/TextureLoader.js";
import ModelLoader from "../core/ModelLoader.js";
import GuiController from './ui/GuiController.js'

export default class WorldManager {
  constructor(app) {
    this.app = app;
    this.scene = app.scene;
    this.textureLoader = new TextureLoader()
    this.modelLoader = new ModelLoader()
    this.gui = new GuiController()
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
    const rocket = await this.modelLoader.load('rocket', '/models/saturn_V_syria.glb')
    const rocket_lancher = await this.modelLoader.load('rocket_lancher', '/models/rocket_laucher_pad.glb')

    // World
    this.scene.background = this.textureLoader.get("space").map;
    this.earth = new Earth(this, this.textureLoader.get("earth"));
    this.rocket = new Rocket(this,rocket);
    this.rocket_lancher = new RocketLaucherPad(this,rocket_lancher);
    this.setGUI()
  }

  update() {}
  setGUI() {
     this.rocket_lancher.setGUI()
  }
}
