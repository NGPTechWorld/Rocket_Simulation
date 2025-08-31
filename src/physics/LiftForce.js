import Force from "./Force";
import Rocket from "./Rocket";
import Environment from "./Environment";
import { Vector3 } from "three";

let instance = null;
export default class LiftForce extends Force {
  constructor() {
    super();
    if (instance) return instance;
    instance = this;

    this.environment = new Environment();
    this.rocket = new Rocket();

    this.liftMagnitude = 0;
    this.liftDirection = new Vector3();

    this.update();
  }

  update() {
    const velocityDir = this.rocket.velocity.clone().normalize();
    const speed = this.rocket.velocity.length();

    const liftDir = new Vector3(-velocityDir.y, velocityDir.x, 0).normalize();

    const aoaClamped = Math.max(
      0,
      Math.min(this.rocket.angle_of_attack, Math.PI / 2)
    );
    const aoaFactor = Math.max(0, Math.sin(2 * aoaClamped));

    const liftMagnitude =
      this.rocket.liftCoefficient *
      this.rocket.crossSectionalArea *
      0.5 *
      this.environment.airDensity *
      Math.pow(speed, 2) *
      aoaFactor;

    const liftForce = liftDir.clone().multiplyScalar(liftMagnitude);

    this.liftDirection.copy(liftDir);
    this.liftMagnitude = liftMagnitude;

    this.force.copy(liftForce);
  }
}
