import Rocket from "./Rocket.js";

let instance = null;
export default class Environment {
  constructor() {
    if (instance) return instance;
    instance = this;

    this.rocket = new Rocket();
    this.airDensity = 1.225;
    this.seaLevelPressure = 101325;
    this.seaLevelTemperature = 288.15;
    this.gravitationalAcceleration = 9.80665;
    this.temperatureLapseRate = 0.0065;
    this.specificGasConstantAir = 287.05;
  }

  updateAirDensity() {
    if (this.rocket.position.y <= 2000000) {
      this.airDensity = 1.225;
    } else if (this.rocket.position.y <= 5000000) {
      this.airDensity = 0.149; //   Stratosphere
    } else if (this.rocket.position.y <= 8500000) {
      this.airDensity = 0.00103; // Mesosphere
    } else {
      this.airDensity = 0; // Thermosphere and higher
    }
  }

  getPressureAtAltitude(altitude) {
    const h = Math.max(0, altitude);
    const T = this.seaLevelTemperature - this.temperatureLapseRate * h;
    if (T <= 0) return 0;
    const exponent =
      this.gravitationalAcceleration /
      (this.specificGasConstantAir * this.temperatureLapseRate);
    return (
      this.seaLevelPressure * Math.pow(T / this.seaLevelTemperature, exponent)
    );
  }

  update() {
    this.updateAirDensity();
  }
}
