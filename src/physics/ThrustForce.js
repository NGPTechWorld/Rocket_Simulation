import Force from './Force.js';

let instance = null;
export default class ThrustForce extends Force {
  constructor(engine, env) {
    super();
    if (instance) return instance;
    instance = this;
    this.engine = engine;
    this.env = env;
  }

  _computeExhaustVelocity(pe) {
    const ft = this.engine.fuel.type;
    const { gamma: γ, R_spec, Tt } = ft;
    const Pt = ft.Pc || 6.8e6;
    const pr = pe / Pt;
    const prCrit = Math.pow(2 / (γ + 1), γ / (γ - 1));
    const expFac = (γ - 1) / γ;
    const factor = (2 * γ) / (γ - 1) * R_spec * Tt;
    if (pr > prCrit) {
      return Math.sqrt(factor * (1 - Math.pow(prCrit, expFac)));
    }
    return Math.sqrt(factor * (1 - Math.pow(pr, expFac)));
  }

  update() {
    this.reset(); 
    const dm = this.engine.updateFuel(this.env.deltaTime || 0);
    if (dm <= 0) return; 
    const mDot = this.engine.getMassFlowRate();
    const { pressure: pe } = this.env.atAltitude(this.engine.rocket.position.y);
    const ve = this._computeExhaustVelocity(pe); 
    const thrust = this.engine.computeThrust(mDot, ve);
    this.force.set(0, thrust, 0);
  }
}
