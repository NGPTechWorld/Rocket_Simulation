const FUEL_DATABASE = {
  'LH2/LOX': {
    density: 71,
    specificHeatRatio: 1.22,
    gasConstant: 8.3144621,
    chamberTemperature: 3251,
    molecularWeight: 18.015,
  },
  'RP-1/LOX': {
    density: 810,
    specificHeatRatio: 1.20,
    gasConstant: 8.3144621,
    chamberTemperature: 3701,
    molecularWeight: 22.0,
  },
};

export default class FuelType {
  constructor(name) {
    const specs = FUEL_DATABASE[name];
    if (!specs) throw new Error(`Unknown fuel type: ${name}`);

    this.name = name;
    this.density = specs.density;
    this.specificHeatRatio = specs.specificHeatRatio;
    this.gasConstant = specs.gasConstant;
    this.chamberTemperature = specs.chamberTemperature;
    this.molecularWeight = specs.molecularWeight;
  }

  getCombustionEfficiency() {
    return 0.95;
  }
}
