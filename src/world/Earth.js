import * as THREE from "three";
import AtomsphereLayer from "./AtmoshpereLayer";

export default class Earth {
  /**
   * @param {import('./WorldManager').default} world
  */
  constructor(world) {
    this.scene = world.scene;
    this.textures = world.textureLoader.get("earth")
    this.setMesh();
  }

  setMesh() {
    const geometry = new THREE.SphereGeometry(998, 64, 64);

    const material = new THREE.MeshStandardMaterial({
      ...this.textures,
      roughness: 0.6, 
      metalness: 0.5, 
      side: 2,

    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(0, -5, 0);
    this.mesh.rotation.set(0.53,0.21,0.77);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    this.scene.add(this.mesh);


    // const axesHelper = new THREE.AxesHelper(7);
    // this.scene.add(axesHelper);

    // ضوء نقطة قوي مع ظلال
    const pointLight = new THREE.PointLight(0xffffff, 2); // زودت شدة الضوء 2 بدل 1
    pointLight.position.set(10, 10, 10);
    pointLight.castShadow = true;
    this.scene.add(pointLight);

    // ضوء اتجاهي قوي مع ظلال
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // شدة أعلى
    directionalLight.position.set(-10, 10, 5);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    // ضروري تفعيل الظلال في الرندر
    // this.app.renderer.shadowMap.enabled = true;
    // this.app.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }
}
