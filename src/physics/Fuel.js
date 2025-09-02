import FuelType from './FuelType.js';

export default class Fuel {
    constructor(initialMass, typeName) {
        this._mass = initialMass;
        this.fuelType = new FuelType(typeName);
    }

    get mass() {
        return this._mass;
    }

    set mass(value) {
        this._mass = Math.max(0, value); 
    }

    setFuelType(typeName) {
    this.fuelType = new FuelType(typeName);
    }

    _consumeFuel(dm) {
        this._mass = Math.max(0, this._mass - dm);
    }

    /* getAdjustedBurnRate(nominalBurnRate) {
         return nominalBurnRate * this.fuelType.getEfficiency();
     }

     update(deltaTime, nominalBurnRate, engine) {
         const dm = this.getAdjustedBurnRate(nominalBurnRate) * deltaTime;
         this._consumeFuel(dm);
         if (this._mass === 0 && engine.isBurning()) engine.stop();
     }*/

         
    update(deltaTime, engine) {
        const massFlowRate = engine.getMassFlowRate();
        
        const dm = massFlowRate
            * this.fuelType.getEfficiency()
            * deltaTime;

        this._consumeFuel(dm);

        if (this._mass <= 0 && engine.isBurning()) {
            engine.stop();
        }
    }
    
    // update(deltaTime, nominalBurnRate, engine) {
    //     const dm = this.getAdjustedBurnRate(nominalBurnRate) * deltaTime;
    //     this._consumeFuel(dm);
    //     if (this._mass === 0 && engine.isBurning()) engine.stop();
    // }

}