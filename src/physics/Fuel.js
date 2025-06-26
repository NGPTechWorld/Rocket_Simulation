export class Fuel {
  /**
   * @param {FuelType} fuelType - Reference to FuelType
   * @param {number} initialFuelMass - Initial fuel mass (kg)
   * @param {number} initialOxidizerMass - Initial oxidizer mass (kg)
   */
  constructor(fuelType, initialFuelMass, initialOxidizerMass) {
    this.fuelType = fuelType;
    this.currentFuelMass = initialFuelMass;
    this.currentOxidizerMass = initialOxidizerMass;
  }

  consume(thrust, standardGravity, ambientPressure, deltaTime) {
    const { fuelMassFlow, oxidizerMassFlow } =
      this.fuelType.getPropellantMassFlowRates(
        thrust,
        standardGravity,
        ambientPressure
      );
    this.currentFuelMass = Math.max(
      this.currentFuelMass - fuelMassFlow * deltaTime,
      0
    );
    this.currentOxidizerMass = Math.max(
      this.currentOxidizerMass - oxidizerMassFlow * deltaTime,
      0
    );
  }
  getRemainingMass() {
    const fuelMass = this.currentFuelMass;
    const oxidizerMass = this.currentOxidizerMass;
    return {
      fuelMass,
      oxidizerMass,
      totalMass: fuelMass + oxidizerMass
    };
  }
  /**
   * @returns {boolean} True if both fuel and oxidizer remain
   */
  hasRemainingPropellant() {
    return this.currentFuelMass > 0 && this.currentOxidizerMass > 0;
  }
}


/**
 * Predefined FuelType instances for Saturn V
 */
export const SaturnVFuelTypes = {
  RP1_LOX: new FuelType(
    'RP-1/LOX',
    810,
    1141,
    2.27,
    263,
    304,
    0.98
  ),
  LH2_LOX: new FuelType(
    'LH2/LOX',
    70.8,
    1141,
    6.0,
    363,
    450,
    0.99
  )
};