import * as THREE from "three";
import WorldManager from "../world/WorldManager.js";

export default class SceneManager {
  /**
   * @param {import('./AppRun.js').default} app
   */
  constructor(app) {
    this.scene = app.scene;

    this.setLights();
    this.setWorld(app);
    // لاحقًا: this.setWorld(), this.setPhysics()
  }

  setLights() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    const directional = new THREE.DirectionalLight(0xffffff, 0.6);
    directional.position.set(3, 5, 2);

    this.scene.add(ambient, directional);
  }

  setWorld(app) {
    this.world = new WorldManager(app);
  }

  update() {
    this.world.update();
  }
}
