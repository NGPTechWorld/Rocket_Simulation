let instance = null;
export default class Earth {
  constructor() {
    if (instance) {
      return instance;
    }
    instance = this;

    this.mass = 5.9722e24;
    this.radius = 6.371e6;
    this.gravityConstant = 6.6743e-11;
  }
}
