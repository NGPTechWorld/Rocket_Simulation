import { Vector3 } from "three";
import Engine from "./Engine.js";

let rocketInstance = null;
export default class Rocket {
  constructor(initialFuelMass = 2_640_000, fuelTypeName = "RP-1/LOX") {
    if (rocketInstance) return rocketInstance;
    rocketInstance = this;
    this.initialFuelMass = initialFuelMass;
    this.position = new Vector3(0, 1, 0);
    this.velocity = new Vector3(0, 0, 0);
    this.acceleration = new Vector3(0, 0, 0);
    this.angle_of_attack = 0;
    this.angularAcceleration = new Vector3();
    this.angularVelocity = new Vector3();
    this.angular = new Vector3();
    this.dryMass = 330_000;
    this.crossSectionalArea = 10.1; 
    this.dragCoefficient = 0.3; 
    this.liftCoefficient = 0.05; 
    this.nozzleCount = 5;
    this.exitArea = 3.8; 
    this.A_throat = 0.65;
    this.diameter = 10; 

    this.engine = new Engine(
      initialFuelMass,
      fuelTypeName,
      this,
      this.exitArea
    );
  }

  getTotalMass() {
    return this.dryMass + this.engine.fuel.mass;
  }

  update() {
    if (this.position.y < 0) {
      this.position.y = 1;
      this.velocity.y = Math.max(1, this.velocity.y);
    }
  }
}
