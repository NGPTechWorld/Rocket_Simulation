import * as THREE from 'three'

export default class Rocket {
  constructor(scene) {
    this.scene = scene
    this.setMesh()
  }

  setMesh() {
    const geometry = new THREE.CylinderGeometry(0.2, 0.5, 3, 32)
    const material = new THREE.MeshBasicMaterial({
      color: 0xff2222
    })

    this.mesh = new THREE.Mesh(geometry, material)
    this.mesh.position.set(0, 0, 0)
    this.scene.add(this.mesh)
  }
}
