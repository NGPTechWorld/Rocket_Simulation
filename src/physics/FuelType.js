/**
 * Class: FuelType
 * Represents immutable properties of a rocket fuel (e.g., densities, oxidizer ratio, specific impulses, combustion efficiency)
 */
export class FuelType {
  /**
   * @param {string} typeName - Fuel type name (e.g., 'RP-1/LOX')
   * @param {number} fuelDensity - Fuel density (kg/m³)
   * @param {number} oxidizerDensity - Oxidizer density (kg/m³)
   * @param {number} oxidizerToFuelRatio - Oxidizer-to-fuel mass ratio
   * @param {number} specificImpulseSeaLevel - Specific impulse at sea level (s)
   * @param {number} specificImpulseVacuum - Specific impulse in vacuum (s)
   * @param {number} combustionEfficiency - Combustion efficiency (0..1)
   */
  constructor(
    typeName,
    fuelDensity,
    oxidizerDensity,
    oxidizerToFuelRatio,
    specificImpulseSeaLevel,
    specificImpulseVacuum,
    combustionEfficiency = 1.0
  ) {
    this.typeName = typeName;
    this.fuelDensity = fuelDensity;
    this.oxidizerDensity = oxidizerDensity;
    this.oxidizerToFuelRatio = oxidizerToFuelRatio;
    this.specificImpulseSeaLevel = specificImpulseSeaLevel;
    this.specificImpulseVacuum = specificImpulseVacuum;
    this.combustionEfficiency = combustionEfficiency;
  }

  /**
   * Compute effective specific impulse based on ambient pressure
   * @param {number} ambientPressure - Ambient pressure (Pa)
   * @param {number} seaLevelPressure - Reference sea-level pressure (Pa)
   * @returns {number} - Effective specific impulse (s)
   */
   getEffectiveSpecificImpulse(ambientPressure, seaLevelPressure = 101325) {
    const factor = Math.min(Math.max(ambientPressure / seaLevelPressure, 0), 1);
    return (
      this.specificImpulseSeaLevel * factor +
      this.specificImpulseVacuum * (1 - factor)
    );
  }

  /**
   * Determine mass flow rates of fuel and oxidizer based on thrust demand
   * @param {number} thrust - Engine thrust (N)
   * @param {number} standardGravity - Standard gravity (m/s²)
   * @param {number} ambientPressure - Ambient pressure (Pa)
   * @returns {{fuelMassFlow: number, oxidizerMassFlow: number}} - Mass flow rates (kg/s)
   */
  getPropellantMassFlowRates(thrust, standardGravity, ambientPressure) {
    const ispEff = this.getEffectiveSpecificImpulse(ambientPressure);
    const exhaustVelocity = ispEff * standardGravity;
    const totalMassFlow = thrust / exhaustVelocity;
    const fuelMassFlow = totalMassFlow / (1 + this.oxidizerToFuelRatio);
    const oxidizerMassFlow = totalMassFlow - fuelMassFlow;
    return {
      fuelMassFlow: fuelMassFlow * this.combustionEfficiency,
      oxidizerMassFlow: oxidizerMassFlow * this.combustionEfficiency
    };
  }

  /**
   * Convert mass flow rates to volumetric flow rates
   * @param {number} thrust - Engine thrust (N)
   * @param {number} standardGravity - Standard gravity (m/s²)
   * @param {number} ambientPressure - Ambient pressure (Pa)
   * @returns {{fuelVolumeFlow: number, oxidizerVolumeFlow: number}} - Volume flow rates (m³/s)
   */
    getPropellantVolumeFlowRates(thrust, standardGravity, ambientPressure) {
    const { fuelMassFlow, oxidizerMassFlow } =
      this.getPropellantMassFlowRates(thrust, standardGravity, ambientPressure);
    return {
      fuelVolumeFlow: fuelMassFlow / this.fuelDensity,
      oxidizerVolumeFlow: oxidizerMassFlow / this.oxidizerDensity
    };
  }
}