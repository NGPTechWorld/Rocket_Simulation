import * as THREE from 'three'

export default class Earth {
  constructor(scene) {
    this.scene = scene
    this.setMesh()
  }

  setMesh() {
    const geometry = new THREE.SphereGeometry(5, 64, 64)
    const material = new THREE.MeshStandardMaterial({
      color: 0x0044ff,
      roughness: 1
    })

    this.mesh = new THREE.Mesh(geometry, material)
    this.mesh.position.set(0, -5, 0)
    this.scene.add(this.mesh)
  }
}
