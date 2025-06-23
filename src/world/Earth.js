import * as THREE from "three";

export default class Earth {
  constructor(world, textures) {
    this.world=world
    this.scene = world.scene;
    this.textures = textures;
    this.setMesh();
  }

  setMesh() {
    const geometry = new THREE.SphereGeometry(5, 64, 64);

    const material = new THREE.MeshStandardMaterial({
      ...this.textures,
      roughness: 0.6, 
      metalness: 0.5, 
      side:2
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, -5, 0);
    mesh.castShadow = true; 
    mesh.receiveShadow = true; 
    this.scene.add(mesh);


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
