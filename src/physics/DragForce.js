import Force from "./Force";
import Rocket from "./Rocket";
import Environment from "./Environment";
import { Vector3 } from "three";

let instance = null;
export default class DragForce extends Force {
  constructor() {
    super();
    if (instance) {
      return instance;
    }
    instance = this;

    this.environment = new Environment();
    this.rocket = new Rocket();

    this.dragMagnitude = 0;
    this.dragDirection = new Vector3();

    this.update();
  }

  update() {
    const velocityDir = this.rocket.velocity.clone().normalize();
    const speed = this.rocket.velocity.length();

    const dragMagnitude =
      this.rocket.dragCoefficient *
      this.rocket.crossSectionalArea *
      0.5 *
      this.environment.airDensity *
      Math.pow(speed, 2);

    const dragForce = velocityDir.clone().multiplyScalar(-dragMagnitude);

    this.force.copy(dragForce);

    this.dragMagnitude = dragMagnitude;
    this.dragDirection.copy(velocityDir).multiplyScalar(-1).normalize(); // عكس الاتجاه
  }
}
