import * as THREE from "three";
import Camera from "./Camera.js";
import Renderer from "./Renderer.js";
import AssetsLoader from "./AssetsLoader.js";
import SceneManager from "./SceneManager.js";
import TextureLoader from "./TextureLoader.js";
import ModelLoader from "./ModelLoader.js";
import SoundManager from "./SoundManager.js";
import Sizes from "./utils/Size.js";
import Time from "./utils/Time.js";
import EventEmitter from "./utils/EventEmitter.js";
import GuiController from "./../world/ui/GuiController.js";
import LoadingScreen from "./../world/ui/LoadingScreen.js";
import GUI from "lil-gui";

export default class AppRun {
  static instance;

  constructor(canvas) {
    if (AppRun.instance) return AppRun.instance;
    AppRun.instance = this;

    this.canvas = canvas;
    this.scene = new THREE.Scene();

    // this.mainMenu = new MainMenu();
    // this.gui = new GuiController();

    this.setupGUI(); // إعداد الواجهات

    this.sizes = new Sizes();
    this.eventEmitter = new EventEmitter();
    this.time = new Time();
    this.camera = new Camera(this);
    this.renderer = new Renderer(this);
    this.loadingScreen = new LoadingScreen();

    this.textureLoader = new TextureLoader();
    this.modelLoader = new ModelLoader();
    this.soundManager = new SoundManager();

    this.assetsLoader = new AssetsLoader(this, this.loadingScreen);

    this.sizes.on("resize", () => this.resize());
    this.time.on("tick", () => this.update());
  }

  // إعداد واجهات المستخدم
  setupGUI() {
    // الواجهة اليمنى: للتحكم
    const guiRight = new GUI(); // يظهر بشكل افتراضي على اليمين

    // الواجهة اليسرى: للمراقبة
    const guiLeft = new GUI();
    guiLeft.domElement.style.position = "absolute";
    guiLeft.domElement.style.left = "0px";
    guiLeft.domElement.style.top = "0px";
    guiLeft.domElement.style.zIndex = "999"; // اجعلها فوق كل شيء
    guiLeft.domElement.style.backgroundColor = "rgba(0,0,0,0.5)"; // اختياري

    // أنشئ وحدتين من GuiController:
    this.guiRight = new GuiController(guiRight);
    this.guiLeft = new GuiController(guiLeft);
  }

  async start() {
    await this.assetsLoader.loadAll({
      textures: [
        {
          name: "sky",
          maps: {
            map: "/textures/puresky.exr",
          },
        },
        {
          name: "earth",
          maps: { map: "/textures/earth_daymap.jpg" },
          repeat: { x: 1, y: 1 },
        },
        {
          name: "space",
          maps: { map: "/textures/outer-space-background.jpg" },
          repeat: { x: 1, y: 1 },
        },
        {
          name: "ground",
          maps: {
            map: "/textures/Ground080_2K-JPG_Color.jpg",
            normalMap: "/textures/Ground080_2K-JPG_NormalGL.jpg",
            roughnessMap: "/textures/Ground080_2K-JPG_Roughness.jpg",
            aoMap: "/textures/Ground080_2K-JPG_AmbientOcclusion.jpg",
            displacementMap: "/textures/Ground080_2K-JPG_Displacement.jpg",
          },
          repeat: { x: 30, y: 30 },
        },
      ],
      models: {
        rocket: "/models/saturn_V_syria.glb",
        rocket_lancher: "/models/rocket_laucher_pad.glb",
        tree: "/models/birch_tree.glb",
        house: "models/build.glb",
        apartment: "models/EEB_015.glb",
        bunker: "models/Bunker.glb",
        city: "models/NEW+CİTY.1blend.glb",
      },
      sounds: {
        explosion: "/sounds/explosion.mp3",
        launch: "/sounds/rocket_lanch.mp3",
      },
    });

    this.loadingScreen.hide();
    //this.mainMenu.show();
    this.sceneManager = new SceneManager(this);
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.camera.update();
    this.sceneManager?.update();
    this.renderer.update();
    // this.physics.update();
  }
}
