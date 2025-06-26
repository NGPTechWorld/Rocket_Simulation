const FUEL_DATABASE = {
  'LH2/LOX': {
    density: 71,                     // kg/m³
    specificHeatRatio: 1.22,         // γ
    gasConstant: 8.3144621,          // J/(mol·K) R_universal
    chamberTemperature: 3251,        // K
    molecularWeight: 0.018015,       // kg/mol
    efficiency: 0.95,                // فرضي
  },
  'RP-1/LOX': {
    density: 810,                    // kg/m³
    specificHeatRatio: 1.20,
    gasConstant: 8.3144621,
    chamberTemperature: 3701,        // K
    molecularWeight: 0.022000,       // kg/mol
    efficiency: 0.93,
  },
};

export default class FuelType {
  constructor(name) {
    const specs = FUEL_DATABASE[name];
    if (!specs) throw new Error(`Unknown fuel type: ${name}`);

    this.name              = name;
    this.density           = specs.density;          
    this.gamma             = specs.specificHeatRatio;
    this.Ru                = specs.gasConstant;   
    this.Tt                = specs.chamberTemperature;
    this.M                 = specs.molecularWeight;
    this.efficiency        = specs.efficiency;
  }

  getCombustionEfficiency() { 
    return this.efficiency;
  }
}
