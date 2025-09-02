import * as THREE from "three";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";

export default class AtmosphereLayer {
  /**
   * @param {import('./WorldManager').default} world
   */
  constructor(world, exrPath, radius = 4.8) {
    this.scene = world.scene;
    this.exrPath = exrPath;
    this.radius = radius;
    this.guiRight = world.guiRight;
    this.exrLoader = new EXRLoader();
    this.skytexture = world.assetsLoader.getTextures()["sky"].map;
    this.material = null;
    this.mesh = null;
    this.nightLight = null;

    this.settings = {
      mode: "day",
    };

    this.setSphere();
    this.initLight();
  }

  setSphere() {
    this.skytexture.mapping = THREE.EquirectangularReflectionMapping;

    const geometry = new THREE.SphereGeometry(this.radius, 64, 64);

    this.material = new THREE.MeshBasicMaterial({
      map: this.skytexture,
      color: new THREE.Color(0xffffff),
      side: THREE.BackSide,
      transparent: true,
      opacity: 1,
      depthWrite: false,
    });

    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.position.set(0, -5, 0);
    this.scene.add(this.mesh);

    this.updateModeTransition();
  }

  initLight() {
    this.nightLight = new THREE.AmbientLight(0x222244, 0);
    this.scene.add(this.nightLight);
  }

  updateModeTransition() {
    if (!this.material) return;

    const isNight = this.settings.mode === "night";
    const nightColor = new THREE.Color(0x0c0c1a);
    const targetColor = isNight
      ? { r: nightColor.r, g: nightColor.g, b: nightColor.b }
      : { r: 0.65, g: 0.65, b: 0.75 };
    const targetOpacity = isNight ? 1 : 0.8;
    const targetLightIntensity = isNight ? 0.5 : 0;

    gsap.to(this.material.color, {
      ...targetColor,
      duration: 2,
      ease: "power2.inOut",
    });

    gsap.to(this.material, {
      opacity: targetOpacity,
      duration: 2,
      ease: "power2.inOut",
    });

    if (this.nightLight) {
      gsap.to(this.nightLight, {
        intensity: targetLightIntensity,
        duration: 2,
        ease: "power2.inOut",
      });
    }
  }

  setGUI() {
    this.guiRight.add(this.settings, "mode", ["day", "night"]).onChange(() => {
      this.updateModeTransition();
    });
  }
}
