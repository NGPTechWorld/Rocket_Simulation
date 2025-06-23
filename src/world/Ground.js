import * as THREE from 'three';

export default class Ground {
  constructor(world,textures,tree,options = {}) {
    this.world = world;
    this.scene = world.scene;
    this.textures = textures;
    this.tree = tree;

    this.radius = options.radius || 25;
    this.thickness = options.thickness || 0.5;
    this.color = options.color || 0xffffffff;
    this.positionY = options.positionY || -5.25;

    this.mesh = null;

    this.setGround();
    this.addTrees();
  }

  setGround() {

    let geometry;

    if (this.thickness > 0) {
      geometry = new THREE.CylinderGeometry(this.radius, this.radius, this.thickness, 64);
    } else {
      geometry = new THREE.CircleGeometry(this.radius, 64);
    }

    geometry.setAttribute(
      'uv2',
      new THREE.BufferAttribute(geometry.attributes.uv.array, 2)
    );

    let materialOptions = {
      color: this.color,
      roughness: 1,     // عشب غير لامع
      metalness: 0.0,
      aoMapIntensity: 4,
      normalScale: new THREE.Vector2(0, 0),
    };

    if (this.textures) {
      materialOptions = {
        ...materialOptions,
        ...this.textures, 
      };
    }

    const material = new THREE.MeshStandardMaterial(materialOptions);

    this.mesh = new THREE.Mesh(geometry, material);

    if (this.thickness === 0) {
      this.mesh.rotation.x = -Math.PI / 2;
    }

    this.mesh.position.set(0, this.positionY, 0);
    this.mesh.receiveShadow = true;

    this.scene.add(this.mesh);
  }

  addTrees(count = 30) {
    const treeGroup = new THREE.Group();

    for (let i = 0; i < count; i++) {
      // زاوية عشوائية
      const angle = Math.random() * Math.PI * 2;
      // مسافة عشوائية من المركز (نأخذ الجذر لتوزيع متوازن)
      const distance = Math.sqrt(Math.random()) * (this.radius - 1);

      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;

      // استنساخ نموذج الشجرة
      const tree = this.tree.clone();
      tree.position.set(x, this.positionY + this.thickness / 2, z);

      // تدوير عشوائي
      tree.rotation.y = Math.random() * Math.PI * 2;

      // مقياس عشوائي
      const scale = 0.8 + Math.random() * 0.4;
      tree.scale.set(scale, scale, scale);

      // إضافة إلى المجموعة
      treeGroup.add(tree);
    }

    this.scene.add(treeGroup);
  }

  setGUI() {
    if (this.world.gui) {
      this.world.gui.addObjectControls('Ground', this.mesh);
    }
  }
}

