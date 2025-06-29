import { Vector3 } from "three";
import WeightForce from "./WeightForce";
import DragForce from "./DragForce";
import LiftForce from "./LiftForce";
import ThrustForce from "./ThrustForce";
import Rocket from "./Rocket";
import Environment from "./Environment";

let instance = null;
export default class Physics {
  constructor() {
    if (instance) {
      return instance;
    }
    instance = this;

    this.deltaTime = 0.1;
    this.time = 0;
    this.rocket = new Rocket();
    this.environment = new Environment();
    this.forces = {
      weight: new WeightForce(),
      drag: new DragForce(),
      lift: new LiftForce(),
      thrust: new ThrustForce(this.rocket.engine),
    };
    this.rocket.engine.fuel._mass = 10000000;
  }

  startEngine() {
    this.rocket.engine.start();
  }
  getTotalForce() {
    let totalForce = new Vector3(0, 0, 0);

    this.sanitizeVector(this.forces.weight.force);
    this.sanitizeVector(this.forces.drag.force);
    this.sanitizeVector(this.forces.lift.force);
    this.sanitizeVector(this.forces.thrust.force);

    totalForce.add(this.forces.weight.force);
    totalForce.add(this.forces.drag.force);
    totalForce.add(this.forces.lift.force);
    totalForce.add(this.forces.thrust.force);

    return totalForce;
  }

  acceleration() {
    this.rocket.acceleration
      .copy(this.getTotalForce())
      .divideScalar(this.rocket.getTotalMass());

    this.sanitizeVector(this.rocket.acceleration);
  }

  velocity() {
    this.rocket.velocity.addScaledVector(
      this.rocket.acceleration,
      this.deltaTime
    );

    this.sanitizeVector(this.rocket.velocity);
  }

  position() {
    this.rocket.position.addScaledVector(this.rocket.velocity, this.deltaTime);

    this.sanitizeVector(this.rocket.position, 1e-3);
  }

  update() {
    this.time_update();
    this.acceleration();
    this.velocity();
    this.position();
    this.rocket.update();
    this.forces.weight.update();
    this.forces.drag.update();
    this.forces.lift.update();
    this.forces.thrust.update(this.deltaTime);
    this.environment.update();
  }

  time_update() {
    this.time = this.time + this.deltaTime;
  }

  sanitizeVector(vector, threshold = 1e-3) {
    vector.set(
      Math.abs(vector.x) < threshold ? 0 : vector.x,
      Math.abs(vector.y) < threshold ? 0 : vector.y,
      Math.abs(vector.z) < threshold ? 0 : vector.z
    );
  }

  getPhysicsParameters() {
    return {
      // Motion
      time: this.time,
      velocity: this.rocket.velocity.toArray(),
      acceleration: this.rocket.acceleration.toArray(),
      position: this.rocket.position.toArray(),

      // Rocket
      "total mass": this.rocket.getTotalMass(),
      "fuel mass": this.rocket.engine.fuel.mass,
      initialFuelMass: this.rocket.initialFuelMass,
      fuelTypeName: this.rocket.engine.fuel.fuelType.name,

      // Forces
      weight: this.forces.weight.force.toArray(),
      drag: this.forces.drag.force.toArray(),
      lift: this.forces.lift.force.toArray(),
      thrust: this.forces.thrust.force.toArray(),
      totalForce: this.getTotalForce().toArray(),

      // Static Rocket Properties
      dryMass: this.rocket.dryMass,
      crossSectionalArea: this.rocket.crossSectionalArea,
      dragCoefficient: this.rocket.dragCoefficient,
      liftCoefficient: this.rocket.liftCoefficient,
      nozzleCount: this.rocket.nozzleCount,
      exitArea: this.rocket.exitArea,
      A_throat: this.rocket.A_throat,
      burnDuration: this.rocket.engine.burnDuration,

      // Environment
      airDensity: this.environment.airDensity,
      seaLevelPressure: this.environment.seaLevelPressure,
      seaLevelTemperature: this.environment.seaLevelTemperature,
      gravitationalAcceleration: this.environment.gravitationalAcceleration,
      temperatureLapseRate: this.environment.temperatureLapseRate,
      specificGasConstantAir: this.environment.specificGasConstantAir,

      // Thrust Info
      ambientPressure: this.environment.getPressureAtAltitude(
        this.rocket.position.y
      ),
      exhaustVelocity: this.forces.thrust._computeExhaustVelocity(
        this.environment.getPressureAtAltitude(this.rocket.position.y)
      ),
      massFlowRate: this.rocket.engine.getMassFlowRate(),
      chamberPressure: this.rocket.engine.fuel.fuelType.chamberPressure,
      chamberTemperature: this.rocket.engine.fuel.fuelType.chamberTemperature,

      //lift info
      liftMagnitude: this.forces.lift.liftMagnitude,
      liftDirection: this.forces.lift.liftDirection.toArray(),

      // Weight Info
      gravityAcceleration: this.forces.weight.gravity,
      weightDirection: this.forces.weight.direction.toArray(),

      // Drag Info
      dragMagnitude: this.forces.drag.dragMagnitude,
      dragDirection: this.forces.drag.dragDirection.toArray(),
    };
  }
}
