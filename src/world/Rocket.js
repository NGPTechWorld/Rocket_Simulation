
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default class Rocket {
  constructor(scene) {
    this.scene = scene;
    this.loader = new GLTFLoader();
    this.setMesh();
  }

  setMesh() {
    // Load the GLB model
    this.loader.load(
      "/models/rocket/scene.gltf",
      (gltf) => {
        this.mesh = gltf.scene;

        // Scale the model if needed
        this.mesh.scale.set(0.01, 0.01, 0.01);

        // Position the rocket
        this.mesh.position.set(0, 0, 0);

        // Add to scene
        this.scene.add(this.mesh);

        console.log("Rocket model loaded successfully");
      },
      (progress) => {
        console.log(
          "Loading progress:",
          (progress.loaded / progress.total) * 100 + "%"
        );
      },
      (error) => {
        console.error("Error loading rocket model:", error);
        // Fallback to basic geometry if model fails to load
        this.setFallbackMesh();
      }
    );
  }

  setFallbackMesh() {
    const geometry = new THREE.CylinderGeometry(0.2, 0.5, 3, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0xff2222,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(0, 0, 0);
    this.scene.add(this.mesh);
  }
}
