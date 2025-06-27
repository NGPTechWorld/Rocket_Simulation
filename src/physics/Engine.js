import Fuel from "./Fuel.js";

export default class Engine {
  constructor(initialFuelMass, fuelTypeName, rocket) {
    this.rocket = rocket;
    this.fuel = new Fuel(initialFuelMass, fuelTypeName);
    this.nominalBurnRate = this.fuel.mass / 168; // kg/s based on exact burn time
    this.thrustTime = 168; // s, S-IC burn duration
    this.elapsedTime = 0;
    this.isActive = false;
  }

  start() {
    this.isActive = true;
    this.elapsedTime = 0;
  }

  stop() {
    this.isActive = false;
  }

  isBurning() {
    return (
      this.isActive && this.elapsedTime < this.thrustTime && this.fuel.mass > 0
    );
  }

  /**
   * تحديث الوقود وكتلة الصاروخ، ثم زيادة العداد الزمني
   */
  updateFuel(deltaTime) {
    if (!this.isBurning()) return 0;
    const prevFuelMass = this.fuel.mass;
    this.fuel.update(deltaTime, this.nominalBurnRate, this.elapsedTime, this);
    const dm = prevFuelMass - this.fuel.mass;
    this.rocket.mass -= dm;
    this.elapsedTime += deltaTime;
    if (this.fuel.mass <= 0) this.stop();
    return dm;
  }

  /**
   * يحسب الدفع من المحرك فقط (دون القوانين الأخرى)
   */
  computeThrust(mDot, ve) {
    return mDot * ve * this.rocket.nozzleCount;
  }

  /**
   * يعيد معدل تدفق الكتلة (kg/s)
   */
  getMassFlowRate() {
    const ft = this.fuel.type;
    const Pt = ft.Pc || 6.8e6;
    const term1 = (this.rocket.A_throat * Pt) / Math.sqrt(ft.Tt);
    const term2 = Math.sqrt(ft.gamma / ft.R_spec);
    const term3 = Math.pow(
      (ft.gamma + 1) / 2,
      -(ft.gamma + 1) / (2 * (ft.gamma - 1))
    );
    const critical = Math.sqrt((2 * ft.gamma) / (ft.gamma + 1));
    return term1 * term2 * term3 * critical * ft.efficiency;
  }
}
