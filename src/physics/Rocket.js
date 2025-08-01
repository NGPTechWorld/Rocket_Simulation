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

    // this.dryMass = 2_822_171;
    this.dryMass = 330_000;
    this.crossSectionalArea = 10.1; //78.5;
    this.dragCoefficient = 0.3;  //0.45;
    this.liftCoefficient = 0.05; // 0.1;
    this.nozzleCount = 5;
    this.exitArea = 3.8; // 6.5; // بدلاً من 15.36
    this.A_throat = 0.25; // 0.28; // بدلاً من 0.96

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
