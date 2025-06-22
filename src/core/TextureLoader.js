import * as THREE from 'three'

export default class TextureLoader {
  constructor() {
    this.loader = new THREE.TextureLoader()
    this.textures = {}
  }

  /**
   * تحميل خرائط خامات متعددة لمادة معينة
   * @param {string} materialName
   * @param {object} maps - { map: path, normalMap: path, ... }
   * @param {object} options - مثل repeat و filters
   * @returns {Promise<void>} - تنتظر تحميل كل الخرائط
   */
  load(materialName, maps, options = {}) {
    this.textures[materialName] = {}

    const promises = []

    for (const type in maps) {
      const promise = new Promise((resolve, reject) => {
        this.loader.load(
          maps[type],

          (texture) => {
            console.log(`🟢 [TextureLoader] ${materialName} - ${type} loaded ✅`)
            texture.wrapS = THREE.RepeatWrapping
            texture.wrapT = THREE.RepeatWrapping
            texture.generateMipmaps = false
            texture.minFilter = THREE.NearestFilter
            texture.magFilter = THREE.NearestFilter

            if (options.repeat) {
              texture.repeat.set(options.repeat.x, options.repeat.y)
            }

            this.textures[materialName][type] = texture
            resolve()
          },

          undefined,

          (error) => {
            console.error(`🔴 [TextureLoader] Failed to load ${materialName} - ${type}`, error)
            reject(error)
          }
        )
      })

      promises.push(promise)
    }

    return Promise.all(promises).then(() => {})
  }

  get(materialName) {
    return this.textures[materialName]
  }
}
