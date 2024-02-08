import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { BasicScene } from "./basicScene";
import * as THREE from "three";
import { Renderer } from "./renderer";
import { SceneMesh } from "./SceneMesh";
import { MouseTracker } from "./mouseTracker";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { CrosshatchPass } from "./crosshatchPass";
export class Canvas {
  canvas: HTMLCanvasElement | null;
  scene: THREE.Scene;
  controls: OrbitControls;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  meshes: SceneMesh[] = [];
  clock: THREE.Clock;
  previousTime: number;
  mouseTracker: MouseTracker;
  composer: EffectComposer;
  constructor(selectorString: string, mouseTracker: MouseTracker) {
    this.mouseTracker = mouseTracker;
    const el = document.getElementById("cvs");
    const sizes = {
      width: el?.offsetWidth ?? 0,
      height: el?.offsetWidth ?? 0,
    };

    this.canvas = document.querySelector(selectorString);
    ({
      scene: this.scene,
      controls: this.controls,
      camera: this.camera,
    } = new BasicScene(this.canvas!, sizes));
    ({ renderer: this.renderer } = new Renderer(this.canvas!, sizes));

    // Composer
    this.composer = new EffectComposer(this.renderer);

    const crosshatchPass = new CrosshatchPass({
      ...sizes,
      scene: this.scene,
      camera: this.camera,
    });

    this.composer.addPass(crosshatchPass);

    this.clock = new THREE.Clock();
    this.previousTime = 0;
    this.tick();
  }

  addMesh(mesh: typeof SceneMesh) {
    this.meshes.push(new mesh(this.scene));
  }

  tick = () => {
    const elapsedTime = this.clock.getElapsedTime();
    const deltaTime = elapsedTime - this.previousTime;
    this.previousTime = elapsedTime;

    // Update controls
    this.controls.update();

    // Render
    this.composer.render();

    //Head
    for (let mesh of this.meshes) {
      if (mesh.mesh) {
        mesh.update(
          deltaTime,
          this.mouseTracker.mousePos.relativeX,
          this.mouseTracker.mousePos.relativeY
        );
      }
    }
    // Call tick again on the next frame
    window.requestAnimationFrame(this.tick);
  };
}
