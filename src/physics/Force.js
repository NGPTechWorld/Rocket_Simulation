import { Vector3 } from "three";

export default class Force {
  constructor() {
    this.force = new Vector3(0, 0, 0);
  }

  update() {}

  reset() {
    this.force.set(0, 0, 0);
  }
}
