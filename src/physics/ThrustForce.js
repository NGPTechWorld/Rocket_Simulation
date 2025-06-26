// ThrustForce.js
import Force from './Force.js';
import Rocket from './Rocket.js';
import Environment from './Environment.js';
import { Vector3 } from 'three';

let instance = null;

export default class ThrustForce extends Force {
  constructor() {
    if (instance) return instance;
    super();
    instance = this;

    this.rocket = new Rocket();
    this.env = new Environment();

    this.A_throat = 8.0;
    this.A_exit = 4.55;
    this.chamberPressure = 6.8e5;

    this.update();
  }

  _computeMassFlowRate() {
    const { specificHeatRatio: γ, gasConstant: Ru, chamberTemperature: Tt, molecularWeight: M } = this.rocket.fuel.type;
    const R_spec = (Ru / M) * 1000;  
    const Pt = this.chamberPressure;
    const term1 = this.A_throat * Pt / Math.sqrt(Tt);
    const term2 = Math.sqrt(γ / R_spec);
    const term3 = Math.pow((γ + 1) / 2, - (γ + 1) / (2 * (γ - 1)));
    return term1 * term2 * term3;
  }

  _computeIdealVe() {
    const { specificHeatRatio: γ, gasConstant: Ru, chamberTemperature: Tt, molecularWeight: M } = this.rocket.fuel.type;
    const R_spec = (Ru / M) * 1000;
    const pe = this.env.pressure;
    const Pt = this.chamberPressure;
    const exp = (γ - 1) / γ;
    return Math.sqrt((2 * γ) / (γ - 1) * R_spec * Tt * (1 - Math.pow(pe / Pt, exp)));
  }

  update() {
    const mDot = this._computeMassFlowRate();
    const veIdeal = this._computeIdealVe();
    const pe = this.env.pressure;
    const p0 = this.env.seaLevelpressure;
    const veEff = veIdeal + ((p0 - pe) * this.A_exit) / mDot;

    const thrust = mDot * veEff;
    this.force.copy(new Vector3(0, thrust, 0));
  }
}
