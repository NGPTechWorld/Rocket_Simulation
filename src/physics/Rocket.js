// Rocket.js
import { Vector3 } from "three";
import Engine from "./Engine.js";

export default class Rocket {
  constructor(
    initialFuelMass = 2_162_000, // kg
    fuelTypeName = "RP-1/LOX"
  ) {
    this.position = new Vector3(0, 0, 0);
    this.velocity = new Vector3(0, 0, 0);
    this.acceleration = new Vector3(0, 0, 0);

    this.dryMass = 137_000; // kg
    this.crossSectionalArea = 10; // m²
    this.dragCoefficient = 0.45;
    this.liftCoefficient = 0.1;

    this.engine = new Engine(initialFuelMass, fuelTypeName, this);
  }

  /**
   * @returns الكتلة الإجمالية للصاروخ (كتلة فارغة + كتلة الوقود) (kg)
   */
  getTotalMass() {
    return this.dryMass + this.engine.fuel.mass;
  }

  update() {
    if (this.position.y < 0) {
      this.position.y = 0;
      this.velocity.y = Math.max(0, this.velocity.y);
    }
  }
}
