import * as THREE from "three";

export class Renderer {
  renderer: THREE.WebGLRenderer;
  constructor(
    canvas: HTMLCanvasElement,
    sizes: { width: number; height: number }
  ) {
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize(sizes.width, sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
}
