import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class BasicScene {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  constructor(
    canvas: HTMLCanvasElement,
    sizes: { width: number; height: number }
  ) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("white");

    /**
     * Camera
     */
    // Base camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      1000
    );
    this.camera.position.set(1.5, 4, 10);
    this.scene.add(this.camera);

    // Controls;
    this.controls = new OrbitControls(new THREE.OrthographicCamera(), canvas);
    this.controls.enableDamping = true;
    this.controls.enableZoom = true;
  }
}
