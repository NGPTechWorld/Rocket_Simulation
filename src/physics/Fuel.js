export default class Fuel {
  /**
   * @param {number} initialMass – كتلة الوقود الابتدائية (kg)
   * @param {string} typeName     
   */
  constructor(initialMass, typeName) {
    this._mass = initialMass;
    this.type  = new FuelType(typeName);
   // this.history = [];
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

  update(deltaTime, nominalBurnRate, currentTime, engine) {
    const dm = this.getBurnRate(nominalBurnRate) * deltaTime;
    this._consume(dm);
 
   // this.history.push({ time: currentTime, mass: this._mass });
 
    if (this._mass === 0 && engine.isBurning()) {
      engine.stop();
    }
  }
}
