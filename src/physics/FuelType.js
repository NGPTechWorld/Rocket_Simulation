const FUEL_DATABASE = {
  "LH2/LOX": {
    density: 70.85,
    gamma: 1.26,
    universalGasConstant: 8.314462618,
    chamberTemperature: 2985, 
    molecularWeight: 0.01801528,     
    combustionEfficiency: 0.97,
    chamberPressure: 5.26e6,   
    ofRatio: 5.5,        
    boiloffRate: 0.0,     
    cryogenic: true
  },
  "RP-1/LOX": {
    density: 810,          
    gamma: 1.24,
    universalGasConstant: 8.314462618,
    chamberTemperature: 3670,
    molecularWeight: 0.0216,
    combustionEfficiency: 0.95,
    chamberPressure: 6.9e6,     
    ofRatio: 2.27,           
    boiloffRate: 0.0,
    cryogenic: false
  }
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
    this.ofRatio = spec.ofRatio ?? null;          // oxidizer mass / fuel mass
    this.boiloffRate = spec.boiloffRate ?? 0.0;   // kg/s total propellant boiloff (if modelled)
    this.cryogenic = spec.cryogenic ?? false;

    // R_specific = R_universal / M (J/(kg*K))
    this.specificGasConstant = this.universalGasConstant / this.molecularWeight;
  }

  // getEfficiency() {
  //   return this.combustionEfficiency;
  // }
}
