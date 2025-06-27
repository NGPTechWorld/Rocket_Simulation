import Environment from './Environment.js';
import Force from './Force.js';

export default class ThrustForce extends Force {
    constructor(engine) {
        super();
        this.engine = engine;
        this.env = new Environment();
    }

    _computeExhaustVelocity(ambientPressure) {
        const ft = this.engine.fuel.fuelType;
        const {chamberPressure: Pt, chamberTemperature: Tt, gamma, specificGasConstant: R} = ft;
        const pr = ambientPressure / Pt;
        const crit = Math.pow(2 / (gamma + 1), gamma / (gamma - 1));
        const expo = (gamma - 1) / gamma;
        const factor = (2 * gamma / (gamma - 1)) * R * Tt;
        if (pr > crit) return Math.sqrt(factor * (1 - Math.pow(crit, expo)));
        return Math.sqrt(factor * (1 - Math.pow(pr, expo)));
    }

    update(dt) {
        this.reset();
        const dm = this.engine.updateFuel(dt);
        if (dm <= 0) return;
        const mfr = this.engine.getMassFlowRate();
        const pa = this.env.getPressureAtAltitude(this.engine.rocket.position.y);
        const ve = this._computeExhaustVelocity(pa);
        const F = this.engine.computeThrust(mfr, ve, pa);
        this.force.set(0, F, 0);
    }
}
