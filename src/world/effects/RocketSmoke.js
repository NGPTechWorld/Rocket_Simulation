import * as THREE from "three";

export default class RocketSmoke {
  constructor(world, rocket) {
    this.world = world;
    this.scene = world.scene;
    this.rocket = rocket;
    this.particles = [];

    const loader = new THREE.TextureLoader();
    this.texture = loader.load("/textures/particles/smoke.png");

    this.lastSpawnTime = 0;
    this.spawnInterval = 80;
  }

  spawnParticle() {
    const material = new THREE.SpriteMaterial({
      map: this.texture,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
      color: 0x555555,
    });

    const sprite = new THREE.Sprite(material);
    const offset = new THREE.Vector3(
      (Math.random() - 0.5) * 4.5, // توسيع النطاق
      -6.0,
      (Math.random() - 0.5) * 4.5
    );

    sprite.position.add(offset);
    sprite.scale.set(3.8, 3.0, 3.8);

    this.rocket.add(sprite);
    sprite.renderOrder = 999;

    this.particles.push({
      sprite,
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.01, // أوسع حركة أفقية
        -0.002 + Math.random() * -0.002, // نزول أبطأ
        (Math.random() - 0.5) * 0.01
      ),
      life: 1.2,
    });
  }

  update() {
    if (this.world.rocket.isLaunching) {
      const now = Date.now();
      if (now - this.lastSpawnTime > this.spawnInterval) {
        this.spawnParticle();
        this.lastSpawnTime = now;
      }

      this.particles.forEach((p, i) => {
        p.sprite.position.add(p.velocity);
        p.life -= 0.01;
        p.sprite.material.opacity = p.life * 0.5;
        p.sprite.scale.multiplyScalar(1.02);

        if (p.life <= 0) {
          this.rocket.remove(p.sprite);
          this.particles.splice(i, 1);
        }
      });
    } else {
      this.particles.forEach((p, i) => {
        this.rocket.remove(p.sprite);
        this.particles.splice(i, 1);
      });
    }
  }
}
