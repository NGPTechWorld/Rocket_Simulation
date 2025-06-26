import * as THREE from 'three';

export default class Ground {
  constructor(world,textures,tree,buildings,options = {}) {
    this.world = world;
    this.scene = world.scene;
    this.buildings = buildings
    this.textures = textures;
    this.tree = tree;

    this.radius = options.radius || 25;
    this.thickness = options.thickness || 0.5;
    this.color = options.color || 0xffffffff;
    this.positionY = options.positionY || -5.25;

    this.mesh = null;

    this.setGround();
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
      roughness: 1,   
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

  addTreesNearBuildings(buildings) {
  const treeGroup = new THREE.Group();

  buildings.forEach((building) => {
    const [x, y, z] = building.position;
    const [sx, , sz] = building.scale;

    const offsetX = sx * 10;
    const offsetZ = sz * 3;  

    const rightTree = this.tree.clone();
    rightTree.position.set(x + offsetX, this.positionY + this.thickness / 2, z + offsetZ);
    rightTree.rotation.y = Math.random() * Math.PI * 2;
    rightTree.scale.set(6, 6, 6);
    treeGroup.add(rightTree);

    const leftTree = this.tree.clone();
    leftTree.position.set(x - offsetX, this.positionY + this.thickness / 2, z - offsetZ);
    leftTree.rotation.y = Math.random() * Math.PI * 2;
    leftTree.scale.set(6, 6, 6);
    treeGroup.add(leftTree);
  });

  this.scene.add(treeGroup);
}

  setGUI() {
    if (this.world.gui) {
      this.world.gui.addObjectControls('Ground', this.mesh);
    }
  }
}

