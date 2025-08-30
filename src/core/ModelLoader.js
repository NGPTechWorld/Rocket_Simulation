import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export default class ModelLoader {
  constructor() {
    this.loader = new GLTFLoader()
    this.models = {}
  }

  async load(name, path, scene = null) {
    if (this.models[name]) {
      console.warn(`[ModelLoader] "${name}" already loaded`)
      return this.models[name]
    }

    return new Promise((resolve, reject) => {
      this.loader.load(
        path,
        (gltf) => {
          console.log(`🟢 [ModelLoader] "${name}" loaded`)
          const model = gltf.scene
          this.models[name] = model

          if (scene) scene.add(model)

          resolve(model)
        },
        undefined,
        (error) => {
          console.error(`🔴 [ModelLoader] Failed to load "${name}"`, error)
          reject(error)
        }
      )
    })
  }


  get(name) {
    return this.models[name] || null
  }
}
