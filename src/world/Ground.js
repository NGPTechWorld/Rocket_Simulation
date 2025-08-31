import * as THREE from "three";

export default class Ground {
  /**
   * @param {import('./WorldManager').default} world
   */
  constructor(world, textures, options = {}) {
    this.scene = world.scene;
    this.textures = textures;
    //this.tree = tree;
    this.guiRight = world.guiRight;
    this.radius = options.radius || 25;
    this.thickness = options.thickness || 0.5;
    this.color = options.color || 0xffffffff;
    this.positionY = -18.8;

    this.mesh = null;
    this.desert2 = world.assetsLoader.getModels().desert2.clone();
    this.desert1 = world.assetsLoader.getModels().desert2.clone();
    this.ite = world.assetsLoader.getTextures()["iteFront"];
    this.setGround();
    this.setT();
    this.setIte(world);
  }
  setIte(world) {
    const wallHeight = 100;
    const wallThickness = 10;
    const wallLength = 500;

    const wallPositions = [
      { x: -400, y: wallHeight / 2, z: 300 },
      { x: -400, y: wallHeight / 2, z: -200 },
      { x: -150, y: wallHeight / 2, z: 50 },
      { x: -650, y: wallHeight / 2, z: 50 },
    ];

    const wallRotations = [
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: 0 },
      { x: 0, y: Math.PI / 2, z: 0 },
      { x: 0, y: Math.PI / 2, z: 0 },
    ];

    const wallTextures = [
      world.assetsLoader.getTextures()["ite_left"],
      world.assetsLoader.getTextures()["ite_left"],
      world.assetsLoader.getTextures()["iteFront"],
      world.assetsLoader.getTextures()["ite_back"],
    ];

    wallPositions.forEach((pos, index) => {
      const geometry = new THREE.BoxGeometry(
        wallLength,
        wallHeight,
        wallThickness
      );
      const material = new THREE.MeshStandardMaterial({
        map: wallTextures[index].map,
        roughness: 0.5,
        metalness: 0.1,
      });

      const wall = new THREE.Mesh(geometry, material);
      wall.position.set(pos.x, pos.y, pos.z);
      wall.rotation.set(
        wallRotations[index].x,
        wallRotations[index].y,
        wallRotations[index].z
      );
      wall.receiveShadow = true;
      wall.castShadow = true;

      this.mesh.add(wall);
    });
    const geometry = new THREE.BoxGeometry(
      75,
      100,
      5
    );
    const material = new THREE.MeshStandardMaterial({
      map:world.assetsLoader.getTextures()["ite_title"].map,
      roughness: 0.5,
      metalness: 0.1,
      transparent: true, 
      opacity: 1.0,
    });
     //const material = new THREE.MeshBasicMaterial({  });
    const wall = new THREE.Mesh(geometry, material);
    wall.position.set(-200+90, 50, -125);
      this.mesh.add(wall);

      const geometrywallUp = new THREE.BoxGeometry(
      500,
      10,
      500
    );
    const materialwallUp = new THREE.MeshStandardMaterial({
      map:world.assetsLoader.getTextures()["ite_up"].map,
      roughness: 0.5,
      metalness: 0.1,
   
    });
    const wallUp = new THREE.Mesh(geometrywallUp, materialwallUp);
    wallUp.position.set(-400, 95, 50);
      this.mesh.add(wallUp);
  }

  setT() {
    this.desert2.position.set(+1231.5, -369.2, -2198.7);
    this.desert2.rotation.set(0, 1.56, 0);
    this.desert2.scale.set(30, 30, 30);
    this.mesh.add(this.desert2);
    this.desert1.position.set(-1360.2, -369.2, +2451.2);
    this.desert1.rotation.set(0, -1.56, 0);
    this.desert1.scale.set(30, 30, 30);
    this.mesh.add(this.desert1);
  }
  setGround() {
    let geometry;

    if (this.thickness > 0) {
      geometry = new THREE.CylinderGeometry(
        this.radius,
        this.radius,
        this.thickness,
        64
      );
    } else {
      geometry = new THREE.CircleGeometry(this.radius, 64);
    }

    geometry.setAttribute(
      "uv2",
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
      this.guiRight.addObjectControls("Ground", this.mesh);
    }
    this.guiRight.addObjectControls("desert", this.desert2);
  }
}
