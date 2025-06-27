import Force from "./Force";
import Rocket from "./Rocket";
import Environment from "./Environment";

let instance = null;
export default class LiftForce extends Force {
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

    const liftDir = new Vector3(-velocityDir.y, velocityDir.x, 0).normalize();

    const liftMagnitude =
      this.rocket.liftCoefficient *
      this.rocket.crossSectionalArea *
      0.5 *
      this.environment.airDensity *
      Math.pow(speed, 2);

    const liftForce = liftDir.clone().multiplyScalar(liftMagnitude);

    this.force.copy(liftForce);
  }
}
