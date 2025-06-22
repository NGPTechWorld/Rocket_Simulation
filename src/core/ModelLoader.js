

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export default class ModelLoader {
  constructor() {
    this.loader = new GLTFLoader()
    this.models = {}
  }

  /**
   * تحميل موديل GLB/GLTF
   * @param {string} name - اسم الموديل
   * @param {string} path - مسار الملف
   * @param {THREE.Scene} scene - المشهد لإضافة الموديل إليه (اختياري)
   * @param {function} callback - يُنفذ عند نجاح التحميل (اختياري)
   */
  load(name, path, scene = null, callback = null) {
    this.loader.load(
      path,

      // ✅ onLoad
      (gltf) => {
        console.log(`🟢 [ModelLoader] "${name}" loaded`)
        const model = gltf.scene
        this.models[name] = model

        if (scene) {
          scene.add(model)
        }

        if (callback) {
          callback(model)
        }
      },

      // ⏳ onProgress (اختياري)
      undefined,

      // ❌ onError
      (error) => {
        console.error(`🔴 [ModelLoader] Failed to load "${name}"`, error)
      }
    )
  }

  /**
   * استرجاع الموديل المحمّل
   */
  get(name) {
    return this.models[name] || null
  }
}
