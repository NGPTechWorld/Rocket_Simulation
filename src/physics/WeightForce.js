import { Vector3 } from "three";
import Force from "./Force";
import Rocket from "./Rocket";
import Earth from "./Earth";

let instance = null;
export default class WeightForce extends Force {
  constructor() {
    if (instance) {
      return instance;
    }
    instance = this;

    super();
    this.earth = new Earth();
    this.rocket = new Rocket();
  }

  computeGravityAcceleration() {
    const height = this.rocket.position.y + this.earth.radius;

    const gravity =
      (this.earth.gravityConstant * this.earth.mass) / Math.pow(height, 2);

    return gravity;
  }

  update() {
    const gravity = this.computeGravityAcceleration();
    const mass = this.rocket.fullMass();

    this.force.set(0, -(gravity * mass), 0);
  }
}
