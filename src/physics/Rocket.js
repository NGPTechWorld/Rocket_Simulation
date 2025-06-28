import {Vector3} from 'three';
import Engine from './Engine.js';

let rocketInstance = null;
export default class Rocket {
    constructor(
        initialFuelMass = 10000000,
        fuelTypeName = 'RP-1/LOX'
    ) {
        if (rocketInstance) return rocketInstance;
        rocketInstance = this;
        this.position = new Vector3(0, 0, 0);
        this.velocity = new Vector3(0, 0, 0);
        this.acceleration = new Vector3(0, 0, 0);

        this.dryMass = 2_822_171;
        this.crossSectionalArea = 78.5;
        this.dragCoefficient = 0.45;
        this.liftCoefficient = 0.1;
        this.nozzleCount = 5;
        this.exitArea = 15.36;
        this.A_throat = 0.96;

        this.engine = new Engine(initialFuelMass, fuelTypeName, this, this.exitArea);
    }

    getTotalMass() {
        return this.dryMass + this.engine.fuel.mass;
    }

    update() {
        if (this.position.y < 0) {
            this.position.y = 0;
            this.velocity.y = Math.max(0, this.velocity.y);
        }
    }
}
