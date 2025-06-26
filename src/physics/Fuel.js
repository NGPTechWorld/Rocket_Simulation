import FuelType from './FuelType.js';

export default class Fuel {
  constructor(initialMass, typeName) {
    this._mass = initialMass;
    this.type = new FuelType(typeName);
  }

  get mass() {
    return this._mass;
  }

  _consume(dm) {
    this._mass = Math.max(0, this._mass - dm);
  }

  getBurnRate(nominalRate) {
    return nominalRate * this.type.getCombustionEfficiency();
  }

  update(deltaTime, nominalBurnRate) {
    const dm = this.getBurnRate(nominalBurnRate) * deltaTime;
    this._consume(dm);
  }
}
