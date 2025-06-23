import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export default class ModelLoader {
  constructor() {
    this.loader = new GLTFLoader()
    this.models = {}
  }

  /**
   * تحميل موديل GLB/GLTF باستخدام Promise
   * @param {string} name - اسم الموديل
   * @param {string} path - مسار الملف
   * @param {THREE.Scene} scene - المشهد لإضافة الموديل إليه (اختياري)
   * @returns {Promise<THREE.Object3D>} - الموديل عند اكتمال التحميل
   */
  async load(name, path, scene = null) {
    if (this.models[name]) {
      console.warn(`[ModelLoader] "${name}" already loaded`)
      return this.models[name]
    }

    return new Promise((resolve, reject) => {
      this.loader.load(
        path,

        // ✅ onLoad
        (gltf) => {
          console.log(`🟢 [ModelLoader] "${name}" loaded`)
          const model = gltf.scene
          this.models[name] = model

          if (scene) scene.add(model)

          resolve(model)
        },

        // ⏳ onProgress
        undefined,

        // ❌ onError
        (error) => {
          console.error(`🔴 [ModelLoader] Failed to load "${name}"`, error)
          reject(error)
        }
      )
    })
  }

  /**
   * استرجاع موديل محمّل سابقًا
   */
  get(name) {
    return this.models[name] || null
  }
}
