import * as THREE from 'three';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default class AtmosphereLayer {
  constructor(scene, exrPath, radius = 4.8) {
    this.scene = scene;
    this.exrPath = exrPath;
    // this.glbPath = glbPath;
    this.radius = radius;

    this.exrLoader = new EXRLoader();
    // this.gltfLoader = new GLTFLoader();

    this.setSphere();
    // this.loadCloudModel();
  }

  // الغلاف الجوي الداخلي
  setSphere() {
    this.exrLoader.load(this.exrPath, (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;

      const geometry = new THREE.SphereGeometry(this.radius, 64, 64);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        color: new THREE.Color(0x0c0c1a),
        side: THREE.BackSide,
        transparent: false,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, -5, 0); // نفس موضع الأرض
      this.scene.add(mesh);
    });
  }

//   // نموذج الغيوم
//   loadCloudModel() {
//     this.gltfLoader.load(this.glbPath, (gltf) => {
//       const model = gltf.scene;

//       model.scale.set(10.5, 10.5, 10.5); // اضبط السلم حسب الحجم المناسب
//       model.position.set(0, -4.5, 0); // داخل الأرض لكن أعلى قليلًا من المركز
//       model.traverse(child => {
//         if (child.isMesh) {
//           child.castShadow = true;
//           child.receiveShadow = true;
//         }
//       });

//       this.scene.add(model);
//     });
//   }
}
