import * as THREE from 'three'
import WorldManager from '../world/WorldManager.js'

export default class SceneManager {
  constructor(app) {
    this.app = app
    this.scene = app.scene
    
    this.setLights()
    this.setWorld()
    // لاحقًا: this.setWorld(), this.setPhysics()
  }

  setLights() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.6)
    const directional = new THREE.DirectionalLight(0xffffff, 0.6)
    directional.position.set(3, 5, 2)

    this.scene.add(ambient, directional)
  }

  setWorld(){
    this.world = new WorldManager(this.app)
  }

  update() {
   
  }
  
}
