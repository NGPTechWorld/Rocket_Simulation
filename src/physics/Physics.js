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
      thrust: new ThrustForce(),
    };
  }

  getTotalForce() {
    let totalForce = new Vector3(0, 0, 0);

    totalForce.add(this.forces.weight.force);
    totalForce.add(this.forces.drag.force);
    totalForce.add(this.forces.lift.force);
    totalForce.add(this.forces.thrust.force);

    return totalForce;
  }

  acceleration() {
    let a = new Vector3();
    a.copy(this.getTotalForce());
    a.divideScalar(this.rocket.fullMass());
    this.rocket.acceleration.copy(a);
  }

  velocity() {
    let v = this.rocket.acceleration;
    this.rocket.velocity.add(v.multiplyScalar(this.deltaTime));
  }

  location() {
    let displacement = new Vector3();
    displacement.copy(this.rocket.velocity);
    displacement.multiplyScalar(this.deltaTime);
    this.rocket.position.add(displacement);
  }

  update() {
    this.time_update();
    this.acceleration();
    this.velocity();
    this.forces.weight.update();
    this.forces.drag.update();
    this.forces.lift.update();
    this.forces.thrust.update();
    this.environment.update();
    this.rocket.update();
  }

  time_update() {
    this.time = this.time + this.deltaTime;
  }
}
