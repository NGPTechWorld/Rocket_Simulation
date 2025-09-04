import TextureLoader from "./TextureLoader.js";
import ModelLoader from "./ModelLoader.js";
import SoundManager from "./SoundManager.js";

export default class AssetsLoader {
  /**
   * @param {import('./../world/ui/LoadingScreen.js').default} loadingScreen
   */
  /**
   * @param {import('./AppRun.js').default} app
   */
  constructor(app, loadingScreen) {
    this.app = app;
    this.loadingScreen = loadingScreen;

    this.textureLoader = new TextureLoader();
    this.modelLoader = new ModelLoader();
    this.soundManager = new SoundManager(app);

    this.total = 0;
    this.loaded = 0;
  }

  async loadAll(manifest) {
    const promises = [];

    const { textures = [], models = {}, sounds = {} } = manifest;

    for (const tex of textures) {
      this.total++;
      const p = this.textureLoader
        .load(tex.name, tex.maps, tex.repeat ? { repeat: tex.repeat } : {})
        .then(() => this._onProgress());
      promises.push(p);
    }

    for (const [name, path] of Object.entries(models)) {
      this.total++;
      const p = this.modelLoader
        .load(name, path)
        .then(() => this._onProgress());
      promises.push(p);
    }

    for (const [name, config] of Object.entries(sounds)) {
      this.total++;
      const {
        path,
        loop = false,
        volume = 1,
      } = typeof config === "string" ? { path: config } : config;

      const p = this.soundManager
        .load(name, path, loop, volume)
        .then(() => this._onProgress());
      promises.push(p);
    }

    await Promise.all(promises);
  }

  _onProgress() {
    this.loaded++;
    const ratio = this.loaded / this.total;
    this.loadingScreen.setProgress(ratio);
  }

  getTextures() {
    return this.textureLoader.textures;
  }

  getModels() {
    return this.modelLoader.models;
  }

  getSounds() {
    return this.soundManager.sounds;
  }

  playSound(name) {
    this.soundManager.play(name);
  }
}
