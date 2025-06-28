import * as THREE from 'three'
export default class BuildingPlacer {
     /**
   * @param {import('./WorldManager').default} world
  */
  constructor(world, buildings) {
    this.world = world;
    this.scene = world.scene;
    this.camera = world.camera.instance;
    this.buildings = buildings

    this.cityInstances = [];

    // this.addCities(cityModel);
    this.placeBuildings(world);
  }

  placeBuildings(world) {
    this.buildings.forEach((entry) => {
      const building = entry.model.clone();

      const [x, yOffset, z] = entry.position || [0, 0, 0];
      const y = world.ground.positionY + world.ground.thickness / 2 + yOffset;
      building.position.set(x, y, z);

      const [sx, sy, sz] = entry.scale || [0.4, 0.4, 0.4];
      building.scale.set(sx, sy, sz);

      const [rx, ry, rz] = entry.rotation || [0, 0, 0];
      building.rotation.set(rx, ry, rz);

      this.scene.add(building);
    });
  }

// addCities(cityModel, count = 7, scale = [20, 20, 20]) {
//   const centerY = this.world.ground.positionY + this.world.ground.thickness / 2;

//   const maxRadius = this.world.ground.radius - 600; 
//   this.cityInstances = [];

//   for (let i = 0; i < count; i++) {
//     const angle = (i / count) * Math.PI * 2;
    
//     const x = Math.cos(angle) * maxRadius;
//     const z = Math.sin(angle) * maxRadius;

//     const city = cityModel.clone();
//     city.position.set(x, centerY, z);
//     city.rotation.y = -angle + Math.PI / 2;
//     city.scale.set(...scale);
//     city.visible = false;

//     this.scene.add(city);
//     this.cityInstances.push(city);
//   }
// }

  // updateVisibleCities() {
  //   const frustum = new THREE.Frustum();
  //   const matrix = new THREE.Matrix4();

  //   this.camera.updateMatrixWorld();
  //   this.camera.updateProjectionMatrix();
  //   matrix.multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse);
  //   frustum.setFromProjectionMatrix(matrix);

  //   this.cityInstances.forEach((city) => {
  //     const box = new THREE.Box3().setFromObject(city);
  //     city.visible = frustum.intersectsBox(box);
  //   });
  // }
}