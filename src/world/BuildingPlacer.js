import * as THREE from 'three'
export default class BuildingPlacer {
     /**
   * @param {import('./WorldManager').default} world
  */
  constructor(world, buildings) {
    this.world = world;
    this.scene = world.ground.mesh;
    this.camera = world.camera.instance;
    this.buildings = buildings
    this.cityInstances = [];
    this.placeBuildings(world);
  }

  placeBuildings(world) {
    this.buildings.forEach((entry) => {
      const building = entry.model.clone();

      const [x, y, z] = entry.position || [0, 0, 0];
      building.position.set(x, y, z);

      const [sx, sy, sz] = entry.scale || [0.4, 0.4, 0.4];
      building.scale.set(sx, sy, sz);

      const [rx, ry, rz] = entry.rotation || [0, 0, 0];
      building.rotation.set(rx, ry, rz);

      this.scene.add(building);
    });
  }
}