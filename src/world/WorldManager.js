import Earth from './Earth.js'
import Rocket from './Rocket.js'
import TextureLoader from '../core/TextureLoader.js'
import ModelLoader from '../core/ModelLoader.js'

export default class WorldManager {
  constructor(app) {
    this.app = app
    this.scene = app.scene
    this.textureLoader = new TextureLoader()
    this.init()
    this.modelLoader = new ModelLoader()

    // this.modelLoader.load(
    //   'rocket',
    //   '/models/rocket/scene.gltf',
    //   this.scene,
    //   (model, animations) => {
    //     model.position.set(0, 0, 0)
    //     // لاحقًا فينا نستخدم animations
    //   }
    // )
  }

  async init() {
    const basePath = '/textures/'
    
    await this.textureLoader.load('earth', {
      map: basePath + 'earth_daymap.jpg',
    }, {
      repeat: { x: 1, y: 1 }
    })
    await this.textureLoader.load('space', {
      map: basePath + 'outer-space-background.jpg',
    }, {
      repeat: { x: 1, y: 1 }
    })

    this.scene.background = this.textureLoader.get('space').map
    this.earth = new Earth(this.scene, this.textureLoader.get('earth'))
    this.rocket = new Rocket(this.scene)
  }

  update() {
    
  }
}
