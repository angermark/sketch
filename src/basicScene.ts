import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { SceneMesh } from "./SceneMesh";

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
     * Lights
     */
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.4);
    //this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.camera.left = -7;
    directionalLight.shadow.camera.top = 7;
    directionalLight.shadow.camera.right = 7;
    directionalLight.shadow.camera.bottom = -7;
    directionalLight.position.set(5, 5, 5);
    // this.scene.add(directionalLight);

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
    //this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.enableZoom = true;
  }
}
