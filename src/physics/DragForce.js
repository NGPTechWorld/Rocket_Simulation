import Force from "./Force";
import Rocket from "./Rocket";
import Environment from "./Environment";

let instance = null;
export default class DragForce extends Force {
  constructor() {
    if (instance) {
      return instance;
    }
    instance = this;

    super();
    this.environment = new Environment();
    this.rocket = new Rocket();

    this.update();
  }

  update() {
    const velocityDir = this.rocket.velocity.clone().normalize();
    const speed = this.rocket.velocity.length();

    const dragMagnitude =
      this.rocket.dragCoefficient *
      this.rocket.A *
      0.5 *
      this.environment.airDensity *
      Math.pow(speed, 2);

    const dragForce = velocityDir.clone().multiplyScalar(-dragMagnitude);

    this.force.copy(dragForce);
  }
}
