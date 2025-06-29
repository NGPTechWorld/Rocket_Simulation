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
    // this.radius = 6378; //km
    this.radius = 6000; //km/
           
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
  const KM_TO_UNITS = 1000;

  const layerMaterials = [
    { color: 0x6ca0f6, opacity: 0.12 }, // Troposphere - أزرق فاتح متوسط
    { color: 0x3b5998, opacity: 0.10 }, // Stratosphere - أزرق متوسط
    { color: 0x2d4373, opacity: 0.08 }, // Mesosphere - أزرق داكن
    { color: 0x1f2d4d, opacity: 0.06 }, // Thermosphere - أزرق داكن جداً
    { color: 0x141a33, opacity: 0.05 }, // Ionosphere - أزرق مائل للأسود
    { color: 0x0d1124, opacity: 0.04 }, // Exosphere - أزرق أسود
  ];

  ATMOSPHERE_LAYERS.forEach((layer, i) => {
    if (!isFinite(layer.maxHeight)) return;

    const geometry = new THREE.SphereGeometry(layer.maxHeight *1000, 64, 64);

    const matInfo = layerMaterials[i] || { color: 0xffffff, opacity: 0.03 };

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(matInfo.color),
      roughness: 0.6, 
      side: THREE.FrontSide,
      metalness: 0.5, 
      side: 2,
      side: THREE.BackSide,
    });

    const layerMesh = new THREE.Mesh(geometry, material);

   
    layerMesh.position.set(0, 5, 0);

    this.scene.add(layerMesh);
  });
}
}
