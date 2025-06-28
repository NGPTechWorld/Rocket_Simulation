import * as THREE from "three";
import AtomsphereLayer from "./AtmoshpereLayer";
import { ATMOSPHERE_LAYERS } from "./AtmoshpereLayerTracker";

export default class Earth {
  /**
   * @param {import('./WorldManager').default} world
  */
  constructor(world) {
    this.scene = world.scene;
    this.textures = world.assetsLoader.getTextures()['earth']
    this.radius = 6378; //km
           
    this.setMesh();
    this.drawAtmosphereLayers();
  }

  setMesh() {
    const geometry = new THREE.SphereGeometry(this.radius, 64, 64);

    const material = new THREE.MeshStandardMaterial({
      ...this.textures,
      roughness: 0.6, 
      side: THREE.FrontSide,
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

drawAtmosphereLayers() {
  const KM_TO_UNITS = 1;

  const layerMaterials = [
    { color: 0x6ca0f6, opacity: 0.12 },
    { color: 0x3b5998, opacity: 0.10 },
    { color: 0x5c90d2, opacity: 0.08 },
    { color: 0x9ec1ff, opacity: 0.06 },
    { color: 0xa8c8ff, opacity: 0.05 },
    { color: 0xd1e0ff, opacity: 0.04 },
  ];

  ATMOSPHERE_LAYERS.forEach((layer, i) => {
    if (!isFinite(layer.maxHeight)) return;

    const layerRadiusKm = this.radius + layer.maxHeight;
    const layerRadius = layerRadiusKm * KM_TO_UNITS;

    const geometry = new THREE.SphereGeometry(layerRadius, 64, 64);

    const matInfo = layerMaterials[i] || { color: 0xffffff, opacity: 0.03 };

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(matInfo.color),
      roughness: 0.6, 
      side: THREE.FrontSide,
      metalness: 0.5, 
      side: 2,
    });

    const layerMesh = new THREE.Mesh(geometry, material);

   
    layerMesh.position.set(0, 5, 0);

    this.scene.add(layerMesh);
  });
}
}
