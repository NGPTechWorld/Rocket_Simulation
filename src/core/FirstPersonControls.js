import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";

export default class FirstPersonControls {
  constructor(camera, canvas, eventEmitter) {
    this.camera = camera;
    this.canvas = canvas;
    this.eventEmitter = eventEmitter;
    this.controls = new PointerLockControls(camera, document.body);
    
    this.moveSpeed = 0.05;
    this.keys = {
      w: false,
      a: false,
      s: false,
      d: false,
      up: false,
      down: false,
      shift: false,
    };
    this._onClickToLock = () => {
      this.controls.lock();
    };
    this.canvas.addEventListener("click",this._onClickToLock);
    this._setupKeyboardListeners();
  }

  _setupKeyboardListeners() {
    document.addEventListener("keydown", (event) => {
      switch (event.code) {
        case "KeyW":
          this.keys.w = true;
          break;
        case "KeyA":
          this.keys.a = true;
          break;
        case "KeyS":
          this.keys.s = true;
          break;
        case "KeyD":
          this.keys.d = true;
          break;
        case "Space":
          this.keys.up = true;
          break;
        case "ShiftLeft":
          this.keys.down = true;
          break;
        case "ControlLeft":
        case "ShiftRight":
          this.keys.shift = true;
          break;
      }
    });

    document.addEventListener("keyup", (event) => {
      switch (event.code) {
        case "KeyW":
          this.keys.w = false;
          break;
        case "KeyA":
          this.keys.a = false;
          break;
        case "KeyS":
          this.keys.s = false;
          break;
        case "KeyD":
          this.keys.d = false;
          break;
        case "Space":
          this.keys.up = false;
          break;
        case "ShiftLeft":
          this.keys.down = false;
          break;
        case "ControlLeft":
        case "ShiftRight":
          this.keys.shift = false;
          break;
      }
    });
  }

  update() {
    const speed = this.keys.shift ? this.moveSpeed * 2 : this.moveSpeed;

    if (this.keys.w) {
      this.controls.moveForward(speed);
    }
    if (this.keys.s) {
      this.controls.moveForward(-speed);
    }
    if (this.keys.a) {
      this.controls.moveRight(-speed);
    }
    if (this.keys.d) {
      this.controls.moveRight(speed);
    }
    if (this.keys.up) {
      this.controls.getObject().position.y += speed;
    }
    if (this.keys.down) {
      this.controls.getObject().position.y -= speed;
    }
  }

  getControls() {
    return this.controls;
  }
}
