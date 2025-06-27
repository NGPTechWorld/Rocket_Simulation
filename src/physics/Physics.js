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

  getTotalForce() {
    let totalForce = new Vector3(0, 0, 0);

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
  }

  velocity() {
    this.rocket.velocity.addScaledVector(
      this.rocket.acceleration,
      this.deltaTime
    );
  }

  position() {
    this.rocket.position.addScaledVector(this.rocket.velocity, this.deltaTime);
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
}
