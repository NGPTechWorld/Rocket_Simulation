import * as THREE from "three";

export default class RocketFire {
  /**
   * @param {import('./WorldManager').default} world
   */
  constructor(world, rocket) {
    this.world = world;

    this.scene = world.scene;
    this.rocket = rocket;
    this.particles = [];

    const loader = new THREE.TextureLoader();
    this.texture = loader.load("/textures/particles/flame.png");

    this.lastSpawnTime = 0;
    this.spawnInterval = 50;
  }

  spawnParticle() {
    const material = new THREE.SpriteMaterial({
      map: this.texture,
      transparent: true,
      opacity: 1,
      depthWrite: false,
      color: 0xff6600,
    });

    const sprite = new THREE.Sprite(material);
    const offset = new THREE.Vector3(
      (Math.random() - 0.5) * 1.6,
      -5.0,
      (Math.random() - 0.5) * 1.6
    );

    sprite.position.add(offset);
    sprite.scale.set(3, 7, 0.7);
    sprite.renderOrder = 999;

    this.rocket.add(sprite);

    this.particles.push({
      sprite,
      velocity: new THREE.Vector3(0, -0.02 + Math.random() * 0.02, 0),
      life: 1,
    });
  }

  update() {
    if (this.world.rocket.isLaunching && this.world.physics.getPhysicsParameters()["fuel mass"] > 0) {
      const now = Date.now();
      if (now - this.lastSpawnTime > this.spawnInterval) {
        this.spawnParticle();
        this.lastSpawnTime = now;
      }

      this.particles.forEach((p, i) => {
        p.sprite.position.add(p.velocity);
        p.life -= 0.02;
        p.sprite.material.opacity = p.life;
        p.sprite.scale.multiplyScalar(0.98);

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
