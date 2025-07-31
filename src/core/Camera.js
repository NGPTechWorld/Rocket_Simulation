import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import FirstPersonControls from "./FirstPersonControls.js";

export default class Camera {
  /**
   * @param {import('./AppRun.js').default} app
   */
  constructor(app) {
    this.sizes = app.sizes;
    this.scene = app.scene;
    this.canvas = app.canvas;
    this.eventEmitter = app.eventEmitter;
    this.currentMode = "follow";
    this.setInstance();
    this.setOrbitControls();

    this.firstPerson = null;
    this.followTargetObj = null;
    this.followOffsets = [
      new THREE.Vector3(0, 50, 150), // خلف الهدف
      new THREE.Vector3(0, 10, -100), // أمام الهدف من فوق
      new THREE.Vector3(100, 50, 100), // جانب الهدف
      new THREE.Vector3(0, 100, 0), // من فوق مباشرة
    ];
    this.followOffsetIndex = 0;
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      60,
      this.sizes.width / this.sizes.height,
      1,
      2e7
    );
    this.instance.position.set(0, 4, 60);
    this.scene.add(this.instance);
  }

  setOrbitControls() {
    this.orbit = new OrbitControls(this.instance, this.canvas);
    this.orbit.enableDamping = true;
    this.orbit.enableZoom = true;
    this.orbit.enablePan = true;
    this.orbit.target.set(0, 1, 0);
  }

  setFirstPersonControls() {
    this.firstPerson = new FirstPersonControls(
      this.instance,
      this.canvas,
      this.eventEmitter
    );
  }

  followTarget(object3D) {
    this.followTargetObj = object3D;
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    switch (this.currentMode) {
      case "orbit":
        if (this.firstPerson) {
          this.canvas.removeEventListener(
            "click",
            this.firstPerson._onClickToLock
          );
        }
        this.orbit.enabled = true;
        this.orbit?.update();
        break;

      case "first":
        if (!this.firstPerson) {
          this.setFirstPersonControls();
        }
        this.firstPerson.update();
        break;

      case "follow":
        if (
          !this.followTargetObj ||
          !this.scene.children.includes(this.followTargetObj)
        ) {
          console.warn("🚨 الكاميرا فقدت الهدف! التحويل إلى Orbit");
          this.switchMode("orbit");
          return;
        }

        const offset = this.followOffsets[this.followOffsetIndex];
        const targetPos = this.followTargetObj.position.clone().add(offset);
        this.instance.position.lerp(targetPos, 0.1);
        this.instance.lookAt(this.followTargetObj.position);
        break;
    }
  }

  switchMode(mode) {
    if (this.currentMode === "first" && this.firstPerson) {
      this.firstPerson.controls.unlock();
    }

    this.currentMode = mode;

    if (this.orbit) {
      this.orbit.enabled = mode === "orbit";
    }

    if (mode === "first" && !this.firstPerson) {
      this.setFirstPersonControls();
    }
  }
  switchFollowView() {
    this.followOffsetIndex =
      (this.followOffsetIndex + 1) % this.followOffsets.length;
  }
}
