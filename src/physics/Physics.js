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

  }

  startEngine(){
    this.rocket.engine.start();
  }
  getTotalForce() {
    let totalForce = new Vector3(0, 0, 0);

    this.sanitizeVector(this.forces.weight.force);
    this.sanitizeVector(this.forces.drag.force);
    this.sanitizeVector(this.forces.lift.force);
    this.sanitizeVector(this.forces.thrust.force);

    totalForce.add(this.forces.weight.force);
    //totalForce.add(this.forces.drag.force);
    // totalForce.add(this.forces.lift.force);
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
      time: this.time,
      velocity: this.rocket.velocity.toArray(),
      acceleration: this.rocket.acceleration.toArray(),
      position: this.rocket.position.toArray(),
      "total mass": this.rocket.getTotalMass(),
      "fuel mass": this.rocket.engine.fuel.mass,
      weight: this.forces.weight.force.toArray(),
      drag: this.forces.drag.force.toArray(),
      lift: this.forces.lift.force.toArray(),
      thrust: this.forces.thrust.force.toArray(),
    };
  }
}
