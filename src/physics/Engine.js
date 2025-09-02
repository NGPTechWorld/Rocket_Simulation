import Fuel from "./Fuel.js";

export default class Engine {
  constructor(initialFuelMass, fuelTypeName, rocket, exitArea) {
    this.rocket = rocket;
    this.fuel = new Fuel(initialFuelMass, fuelTypeName);
    this.nominalBurnRate = this.fuel.mass / 168; // بدلاً من 168
    this.burnDuration = 168;
    this.elapsedTime = 0;
    this.isActive = false;
    this.exitArea = exitArea != null ? exitArea : rocket.exitArea;
  }

  start() {
    this.isActive = true;
    this.elapsedTime = 0;
  }

  stop() {
    this.isActive = false;
  }

  isBurning() {
    return (
      this.isActive &&
      // this.elapsedTime < this.burnDuration &&
      this.fuel.mass > 0
    );
  }

  updateFuel(deltaTime) {
    if (!this.isBurning()) return 0;
    const prev = this.fuel.mass;
    this.fuel.update(deltaTime, this);
    const consumed = prev - this.fuel.mass;
    this.elapsedTime += deltaTime;
    if (this.fuel.mass <= 0) this.stop();
    return consumed;
  }

  computeThrust(massFlowRate, exhaustVelocity, ambientPressure) {
    const N = this.rocket.nozzleCount;
    const momentum = massFlowRate * exhaustVelocity * N;
    const ft = this.fuel.fuelType;
    const critRatio = Math.pow(2 / (ft.gamma + 1), ft.gamma / (ft.gamma - 1));
    const exitPressure = ft.chamberPressure * critRatio;
    // pressure thrust
    const pressureTerm = (exitPressure - ambientPressure) * this.exitArea * N;
    return momentum + pressureTerm;
  }

  getMassFlowRate() {
    const ft = this.fuel.fuelType;
    const {
      chamberPressure: Pt,
      chamberTemperature: Tt,
      gamma,
      specificGasConstant: R,
    } = ft;

    const term =
      (Pt / Math.sqrt(Tt)) *
      Math.sqrt(gamma / R) *
      Math.pow((gamma + 1) / 2, -(gamma + 1) / (2 * (gamma - 1)));

    return this.rocket.nozzleCount * this.rocket.A_throat * term;
  }
}
