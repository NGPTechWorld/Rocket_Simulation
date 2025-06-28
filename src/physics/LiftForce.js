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

    // 🆕 متغيرات جديدة لتخزين بيانات القوة
    this.liftMagnitude = 0;
    this.liftDirection = new Vector3();

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

    // 🆕 تخزين الاتجاه والشدة لاستخدامهم لاحقًا في getPhysicsParameters
    this.liftDirection.copy(liftDir);
    this.liftMagnitude = liftMagnitude;

    this.force.copy(liftForce);
  }
}
