import Force from "./Force";
import Rocket from "./Rocket";
import Earth from "./Earth";

let instance = null;
export default class WeightForce extends Force {
  constructor() {
    super();
    if (instance) {
      return instance;
    }
    instance = this;

    this.earth = new Earth();
    this.rocket = new Rocket();
    this.update();
  }

  computeGravityAcceleration() {
    const height = this.rocket.position.y + this.earth.radius;

    const gravity =
      (this.earth.gravityConstant * this.earth.mass) / Math.pow(height, 2);

    return gravity;
  }

  update() {
    const gravity = this.computeGravityAcceleration();
    const mass = this.rocket.getTotalMass();

    const directionToEarthCenter = this.rocket.position
      .clone()
      .negate()
      .normalize(); // to earth center (0, 0, 0)

    this.force.copy(directionToEarthCenter.multiplyScalar(gravity * mass));
  }
}
