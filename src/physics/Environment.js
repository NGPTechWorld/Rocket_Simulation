import Rocket from "./Rocket";

let instance = null;
export default class Environment {
  constructor() {
    if (instance) {
      return instance;
    }
    instance = this;

    this.rocket = new Rocket();
    this.airDensity = 1.225; // Troposphere
    this.seaLevelpressure = 101325;
    this.seaLevelTemperature = 288.15;
    this.Temperature_lapse_rate = 0.0065;
  }

  updateAirDensity() {
    if (this.rocket.position.y <= 50000) {
      this.airDensity = 0.149; //   Stratosphere
    } else if (this.rocket.position.y <= 85000) {
      this.airDensity = 0.00103; // Mesosphere
    } else {
      this.airDensity = 0; // Thermosphere and higher
    }
  }

  update() {
    this.updateAirDensity();
  }
}
