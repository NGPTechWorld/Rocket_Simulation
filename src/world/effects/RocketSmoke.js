import * as THREE from "three";

export default class RocketSmoke {
  constructor(scene, rocket) {
    this.scene = scene;
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
      (Math.random() - 0.5) * 1.5,
      -1.5,
      (Math.random() - 0.5) * 1.5
    );

    sprite.position.copy(this.rocket.position).add(offset);
    sprite.scale.set(1.9, 1.5, 1.9);

    this.scene.add(sprite);

    this.particles.push({
      sprite,
      //   velocity: new THREE.Vector3(0, -0.01 + Math.random() * 0.01, 0),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.003, // حركة جانبية بطيئة
        -0.005 + Math.random() * -0.002, // أبطأ نزول
        (Math.random() - 0.5) * 0.003
      ),
      life: 1.2,
    });
  }

  update() {
    const now = Date.now();
    if (now - this.lastSpawnTime > this.spawnInterval) {
      this.spawnParticle();
      this.lastSpawnTime = now;
    }

    this.particles.forEach((p, i) => {
      p.sprite.position.add(p.velocity);
      p.life -= 0.01;
      p.sprite.material.opacity = p.life * 0.5;
      p.sprite.scale.multiplyScalar(1.02); // يتوسع

      if (p.life <= 0) {
        this.scene.remove(p.sprite);
        this.particles.splice(i, 1);
      }
    });
  }
}
