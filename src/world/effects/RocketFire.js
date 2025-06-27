import * as THREE from 'three'

export default class RocketFire {
   constructor(scene, rocket) {
    this.scene = scene
    this.rocket = rocket
    this.particles = []

    const loader = new THREE.TextureLoader()
    this.texture = loader.load('/textures/particles/flame.png')

    this.lastSpawnTime = 0
    this.spawnInterval = 50 
  }

  spawnParticle() {
    const material = new THREE.SpriteMaterial({
      map: this.texture,
      transparent: true,
      opacity: 1,
      depthWrite: false,
      color: 0xff6600,
    })

    const sprite = new THREE.Sprite(material)
    const offset = new THREE.Vector3(
      (Math.random() - 0.5) * 0.4,
      -1.8,
      (Math.random() - 0.5) * 0.4
    )

    sprite.position.copy(this.rocket.position).add(offset)
    sprite.scale.set(0.7, 2, 0.7)

    this.scene.add(sprite)

    this.particles.push({
      sprite,
      velocity: new THREE.Vector3(0, 0.02 + Math.random() * 0.02, 0),
      life: 1, 
    })
  }

  update() {
    const now = Date.now()
    if (now - this.lastSpawnTime > this.spawnInterval) {
      this.spawnParticle()
      this.lastSpawnTime = now
    }

    this.particles.forEach((p, i) => {
      p.sprite.position.add(p.velocity)
      p.life -= 0.02
      p.sprite.material.opacity = p.life
      p.sprite.scale.multiplyScalar(0.98)

      if (p.life <= 0) {
        this.scene.remove(p.sprite)
        this.particles.splice(i, 1)
      }
    })
  }
}
