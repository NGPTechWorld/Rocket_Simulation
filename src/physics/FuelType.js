const FUEL_DATABASE = {
  "LH2/LOX": {
    density: 71, // kg/m³
    gamma: 1.2, // LH2 γ≈1.2
    universalGasConstant: 8.3144621,
    chamberTemperature: 3600, // K
    molecularWeight: 0.0023, // H2/LOX منخفض جداً
    combustionEfficiency: 0.98,
    chamberPressure: 20.7e6, // Pa
  },
  "RP-1/LOX": {
    density: 810, // kg/m³
    gamma: 1.22,
    universalGasConstant: 8.3144621,
    chamberTemperature: 3670, // K
    molecularWeight: 0.022,
    combustionEfficiency: 0.93,
    chamberPressure: 7.0e6, // Pa
  },
};
export default class FuelType {
  constructor(name) {
    const spec = FUEL_DATABASE[name];
    if (!spec) throw new Error(`Unknown fuel type: ${name}`);
    this.name = name;
    this.density = spec.density;
    this.gamma = spec.gamma;
    this.universalGasConstant = spec.universalGasConstant;
    this.chamberTemperature = spec.chamberTemperature;
    this.molecularWeight = spec.molecularWeight;
    this.combustionEfficiency = spec.combustionEfficiency;
    this.chamberPressure = spec.chamberPressure;
    // R_specific = R_universal / M
    this.specificGasConstant = this.universalGasConstant / this.molecularWeight;
  }

  getEfficiency() {
    return this.combustionEfficiency;
  }
}
