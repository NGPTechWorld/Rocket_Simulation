import Force from "./Force";
import Rocket from "./Rocket";
import Earth from "./Earth";
import { Vector3 } from "three";
import Environment from "./Environment";
let instance = null;
export default class WeightForce extends Force {
  constructor() {
    super();
    if (instance) {
      return instance;
    }
    instance = this;

    this.gravity = 0;
    this.direction = new Vector3();
    this.environment = new Environment();
    this.earth = new Earth();
    this.rocket = new Rocket();
    this.update();
  }

  computeGravityAcceleration() {
    const height = this.rocket.position.y + this.earth.radius;

    const naturalGravity =
      (this.earth.gravityConstant * this.earth.mass) / Math.pow(height, 2);

    // Scale by User gravity
    return (
      naturalGravity * (this.environment.gravitationalAcceleration / 9.80665)
    );
  }

  update() {
    const gravity = this.computeGravityAcceleration();
    // simpler 
    //  const gravity = this.environment.gravitationalAcceleration;
    
    const mass = this.rocket.getTotalMass();

    const directionToEarthCenter = this.rocket.position
      .clone()
      .negate()
      .normalize(); // to earth center (0, 0, 0)

    this.force.copy(directionToEarthCenter.multiplyScalar(gravity * mass));

    this.gravity = gravity;
    this.direction.copy(directionToEarthCenter);
  }
}
