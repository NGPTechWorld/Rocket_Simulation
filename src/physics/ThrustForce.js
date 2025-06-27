import Environment from "./Environment.js";
import Force from "./Force.js";

let instance = null;
export default class ThrustForce extends Force {
  constructor(engine) {
    super();
    if (instance) return instance;
    instance = this;
    this.engine = engine;
    this.env = new Environment();
  }

  _computeExhaustVelocity(pe) {
    const ft = this.engine.fuel.type;
    const Pt = ft.Pc || 6.8e6;
    const pr = pe / Pt;
    const prCrit = Math.pow(2 / (ft.gamma + 1), ft.gamma / (ft.gamma - 1));
    const expFac = (ft.gamma - 1) / ft.gamma;
    const factor = ((2 * ft.gamma) / (ft.gamma - 1)) * ft.R_spec * ft.Tt;
    if (pr > prCrit) {
      return Math.sqrt(factor * (1 - Math.pow(prCrit, expFac)));
    }
    return Math.sqrt(factor * (1 - Math.pow(pr, expFac)));
  }

  update(deltaTime) {
    this.reset();
    const dm = this.engine.updateFuel(deltaTime || 0);
    if (dm <= 0) return;
    const mDot = this.engine.getMassFlowRate();
    const { pressure: pe } = this.env.atAltitude(this.engine.rocket.position.y);
    const ve = this._computeExhaustVelocity(pe);
    const thrust = this.engine.computeThrust(mDot, ve);
    this.force.set(0, thrust, 0);
  }
}
