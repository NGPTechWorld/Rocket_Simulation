import * as THREE from 'three'

export default class ExplosionEffect {
  constructor(world, position) {
    this.world = world
    this.position = position.clone()

    this.createFlash()
    // this.createSmokeParticles()
    this.shakeCamera()
    this.playSound()
  }

  createFlash() {
    const flash = new THREE.PointLight(0xff5500, 500000, 1000000)
    flash.position.copy(this.position).add(new THREE.Vector3(0, 50, 0))
    flash.castShadow = true
    this.world.scene.add(flash)

    const ambientFlash = new THREE.AmbientLight(0xff2200, 3)
    this.world.scene.add(ambientFlash)

    setTimeout(() => {
      this.world.scene.remove(flash)
      this.world.scene.remove(ambientFlash)
    }, 15000)


    const crashMessage = document.getElementById('crash-message');
    if (crashMessage) {
      crashMessage.style.display = 'flex';
    }
  }

  createSmokeParticles() {
    const smokeTex = this.world.assetsLoader.getTextures().smoke?.map
    if (!smokeTex) return

    for (let i = 0; i < 80; i++) {
      const material = new THREE.SpriteMaterial({
        map: smokeTex,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
        color: 0x111111
      })

      const sprite = new THREE.Sprite(material)
      const offset = new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 8
      )

      sprite.position.copy(this.position).add(offset)
      sprite.scale.set(5, 5, 5)

      this.world.scene.add(sprite)

      setTimeout(() => {
        this.world.scene.remove(sprite)
      }, 3000)
    }
  }

  shakeCamera() {
    const cam = this.world.camera.instance
    const original = cam.position.clone()
    let count = 0

    const interval = setInterval(() => {
      cam.position.x = original.x + (Math.random() - 0.5) * 1.5
      cam.position.y = original.y + (Math.random() - 0.5) * 1.5
      cam.position.z = original.z + (Math.random() - 0.5) * 1.5

      if (++count > 20) {
        clearInterval(interval)
        cam.position.copy(original)
      }
    }, 30)
  }

  playSound() {
    this.world.assetsLoader.soundManager.play('explosion')
  }
}
