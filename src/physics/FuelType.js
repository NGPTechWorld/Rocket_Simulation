const FUEL_DATABASE = {
    'LH2/LOX': {
        density: 71,
        gamma: 1.22,
        universalGasConstant: 8.3144621,
        chamberTemperature: 3251,
        molecularWeight: 0.018015,
        combustionEfficiency: 0.95,
        chamberPressure: 8.0e6
    },
    'RP-1/LOX': {
        density: 810,
        gamma: 1.20,
        universalGasConstant: 8.3144621,
        chamberTemperature: 3701,
        molecularWeight: 0.022000,
        combustionEfficiency: 0.93,
        chamberPressure: 6.8e6
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
        // R_specific = R_universal / M
        this.specificGasConstant = this.universalGasConstant / this.molecularWeight;
    }

    getEfficiency() {
        return this.combustionEfficiency;
    }
}
