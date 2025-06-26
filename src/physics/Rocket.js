// Rocket.js
import { Vector3 } from 'three';
import Environment from './Environment.js';
import Engine from './Engine.js';
import ThrustForce from './ThrustForce.js';
import DragForce from './DragForce.js';
import WeightForce from './WeightForce.js';
import liftForce from './LiftForce.js';


export default class Rocket {
  constructor(
    initialFuelMass = 2_162_000,        // kg
    fuelTypeName    = 'RP-1/LOX'
  ) { 
    this.env = new Environment();
 
    this.position     = new Vector3(0, 0, 0);
    this.velocity     = new Vector3(0, 0, 0);
    this.acceleration = new Vector3(0, 0, 0);
 
    this.dryMass             = 137_000;  // kg
    this.crossSectionalArea  = 10;       // m² (تقريبي)
    this.dragCoefficient     = 0.3;      // تقديري
 
    this.engine = new Engine(
      initialFuelMass,
      fuelTypeName,
      this.env,
      this
    );
 
    this.thrustForce = new ThrustForce(this.engine, this.env);
    this.dragForce   = new DragForce();
    this.weightForce = new WeightForce();
    this.liftForce   = new liftForce();
    this.forces = [
      this.thrustForce,
      this.dragForce,
      this.weightForce,
      this.liftForce
    ];
  }

  /** 
   * @returns الكتلة الإجمالية للصاروخ (كتلة فارغة + كتلة الوقود) بالـ kg 
   */
  getTotalMass() {
    return this.dryMass + this.engine.fuel.mass;
  }
 
  update(deltaTime) { 
    this.env.deltaTime = deltaTime; 
    const netForce = new Vector3();
    for (const f of this.forces) {
      f.update();
      netForce.add(f.force);
    }
 
    this.acceleration
      .copy(netForce)
      .divideScalar(this.getTotalMass());
 
    this.velocity.addScaledVector(this.acceleration, deltaTime);
    this.position.addScaledVector(this.velocity,     deltaTime);
 
    if (this.position.y < 0) {
      this.position.y = 0;
      this.velocity.y = Math.max(0, this.velocity.y);
    }
  }
 
  getFlightData() {
    const { pressure, density } = this.env.atAltitude(this.position.y);
    return {
      altitude:       this.position.y,                          // m
      velocity:       this.velocity.length(),                   // m/s
      acceleration:   this.acceleration.length(),               // m/s²
      mass:           this.getTotalMass(),                      // kg
      thrust:         this.thrustForce.force.length(),          // N
      thrustToWeight: this.thrustForce.force.length() 
                     / (this.getTotalMass() * 9.80665),        // نسبة الدفع إلى الوزن
      fuelMass:       this.engine.fuel.mass,                    // kg
      atmPressure:    pressure,                                 // Pa
      atmDensity:     density,                                  // kg/m³
    };
  }
}
