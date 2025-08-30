import * as THREE from 'three';

export default class Ground {
     /**
   * @param {import('./WorldManager').default} world
  */
  constructor(world,textures,options = {}) {
    this.scene = world.scene;
    this.textures = textures;
    //this.tree = tree;
    this.guiRight =world.guiRight
    this.radius = options.radius || 25;
    this.thickness = options.thickness || 0.5;
    this.color = options.color || 0xffffffff;
    this.positionY = -18.8;

    this.mesh = null;
this.desert2 = world.assetsLoader.getModels().desert2.clone();
this.desert1 = world.assetsLoader.getModels().desert2.clone();
    this.setGround();
    this.setT();
  }
  setT(){
      this.desert2.position.set(+1231.5, -369.2, -2198.7)
      this.desert2.rotation.set(0, 1.56, 0)
      this.desert2.scale.set(30, 30, 30)
      this.mesh.add(this.desert2)
      this.desert1.position.set(-1360.2, -369.2, +2451.2)
      this.desert1.rotation.set(0, -1.56, 0)
      this.desert1.scale.set(30, 30, 30)
      this.mesh.add(this.desert1)
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

    this.mesh.position.set(0, -18.8, 0);
    this.mesh.receiveShadow = true;

    this.scene.add(this.mesh);
  }


  setGUI() {
    if (this.guiRight) {
      this.guiRight.addObjectControls('Ground', this.mesh);
    }
     this.guiRight.addObjectControls('desert',this.desert2)
  }
}

