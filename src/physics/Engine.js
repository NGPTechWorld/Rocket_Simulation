import Fuel from './Fuel.js';
import ThrustForce from './ThrustForce.js';
import { Vector3 } from 'three';

export default class Engine {
  constructor(initialFuelMass, fuelTypeName, env) {
    this.fuel = new Fuel(initialFuelMass, fuelTypeName);
    this.env = env;

    this.nominalBurnRate = 12890;
    this.thrustTime = 200;
    this.nozzleCount = 5;

    this.thrustForce = new ThrustForce(this.fuel, this.env);
    this.thrustVector = new Vector3();
    this.isActive = false;
    this.elapsedTime = 0;
  }

  start() {
    this.isActive = true;
    this.elapsedTime = 0;
  }

  stop() {
    this.isActive = false;
  }

  isBurning() {
    return this.isActive && this.elapsedTime < this.thrustTime;
  }

  update(deltaTime) {
    if (!this.isBurning()) {
      this.isActive = false;
      this.thrustVector.set(0, 0, 0);
      return;
    }

    this.fuel.update(deltaTime, this.nominalBurnRate);
    this.thrustForce.update();

    this.thrustVector.copy(this.thrustForce.force).multiplyScalar(this.nozzleCount);
    this.elapsedTime += deltaTime;
  }
}
