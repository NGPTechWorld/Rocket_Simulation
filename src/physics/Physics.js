import * as THREE from "three";
const { Vector3 } = THREE;

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
    // this.rocket.engine.fuel._mass = 50000;
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

  getPosition() {
    return new Vector3(this.rocket.position.x, this.rocket.position.y, 0);
  }

  // حساب العزم الدوراني وتأثيره على الموقع وزاوية الهجوم
  torque() {
    // مجموع القوى الهوائية (Drag + Lift)
    const totalAerodynamicForce = new Vector3().addVectors(
      this.forces.drag.force,
      this.forces.lift.force
    );

    if (this.environment.airDensity <= 1e-5) return;

    this.rocket.angle_of_attack = totalAerodynamicForce.angleTo(
      new Vector3(0, 1, 0)
    );

    const rotationMatrixY = new THREE.Matrix4().makeRotationY(
      -this.rocket.angle_of_attack
    );

    this.rocket.position.applyMatrix4(rotationMatrixY);
  }

  // الحركة الدورانية
  angularMotion() {
    // التسارع الزاوي = التسارع الخطي / نصف القطر
    this.rocket.angularAcceleration
      .copy(this.rocket.acceleration)
      .divideScalar(this.rocket.diameter / 2);

    const dampingFactor = 1;
    const damping = this.rocket.angularVelocity
      .clone()
      .multiplyScalar(-dampingFactor);

    this.rocket.angularAcceleration.add(damping);

    this.sanitizeVector(this.rocket.angularAcceleration);

    // حساب السرعة الدورانية
    this.rocket.angularVelocity.addScaledVector(
      this.rocket.angularAcceleration,
      this.deltaTime
    );
    this.rocket.angularVelocity.clampLength(0, 4);

    this.sanitizeVector(this.rocket.angularVelocity);

    // حساب الزاوية
    this.rocket.angular.addScaledVector(
      this.rocket.angularVelocity,
      this.deltaTime
    );

    this.sanitizeVector(this.rocket.angular);
  }

  update() {
    this.time_update();
    this.acceleration();
    this.velocity();
    this.position();
    this.torque();
    this.angularMotion();
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
  setPhysicsParameters({
    // Default Values if not passed
    // Rocket
    dryMass = this.rocket.dryMass,
    initialFuelMass = this.rocket.initialFuelMass,
    A_throat = this.rocket.A_throat,
    fuelType = this.rocket.engine.fuel.fuelType.name,
    crossSectionalArea = this.rocket.crossSectionalArea,
    dragCoefficient = this.rocket.dragCoefficient,
    liftCoefficient = this.rocket.liftCoefficient,
    nozzleCount = this.rocket.nozzleCount,
    exitArea = this.rocket.exitArea,
    burnDuration = this.rocket.engine.burnDuration,

    // Environment
    airDensity = this.environment.airDensity,
    seaLevelPressure = this.environment.seaLevelPressure,
    seaLevelTemperature = this.environment.seaLevelTemperature,
    gravitationalAcceleration = this.environment.gravitationalAcceleration,
    temperatureLapseRate = this.environment.temperatureLapseRate,
    specificGasConstantAir = this.environment.specificGasConstantAir,

    deltaTime = this.deltaTime,
  } = {}) {
    // The `= {}` makes the whole parameter optional

    // Update rocket properties
    this.rocket.dryMass = dryMass;
    this.rocket.initialFuelMass = initialFuelMass;
    this.rocket.engine.fuel.mass = initialFuelMass;
    this.rocket.A_throat = A_throat;
    this.rocket.engine.fuel.setFuelType(fuelType);
    this.rocket.crossSectionalArea = crossSectionalArea;
    this.rocket.dragCoefficient = dragCoefficient;
    this.rocket.liftCoefficient = liftCoefficient;
    this.rocket.nozzleCount = nozzleCount;
    this.rocket.exitArea = exitArea;
    this.rocket.engine.burnDuration = burnDuration;

    // Update environment properties
    this.environment.airDensity = airDensity;
    this.environment.seaLevelPressure = seaLevelPressure;
    this.environment.seaLevelTemperature = seaLevelTemperature;
    this.environment.gravitationalAcceleration = gravitationalAcceleration;
    this.environment.temperatureLapseRate = temperatureLapseRate;
    this.environment.specificGasConstantAir = specificGasConstantAir;

    this.deltaTime = deltaTime;
  }

  getPhysicsParameters() {
    return {
      // Motion
      time: this.time,
      // الحركة الخطية
      velocity: this.rocket.velocity.toArray(),
      acceleration: this.rocket.acceleration.toArray(),
      // الحركة الزاوية
      angular: this.rocket.angular.toArray(),
      angularVelocity: this.rocket.angularVelocity.toArray(),
      angularAcceleration: this.rocket.angularAcceleration.toArray(),
      angle_of_attack: this.rocket.angle_of_attack,
      position: this.getPosition().toArray(),

      // Rocket
      totalMass: this.rocket.getTotalMass(),
      fuelMass: this.rocket.engine.fuel.mass,
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
      diameter: this.rocket.diameter,

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
