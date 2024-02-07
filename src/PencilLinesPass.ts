import { Pass, FullScreenQuad } from "three/examples/jsm/postprocessing/Pass";
import * as THREE from "three";
import { PencilLinesMaterial } from "./pencilLinesMaterial";

export class PencilLinesPass extends Pass {
  fsQuad: FullScreenQuad;
  material: PencilLinesMaterial;
  normalMaterial: THREE.MeshNormalMaterial;
  normalBuffer: THREE.WebGLRenderTarget;
  scene;
  camera;
  backupTexture;
  previousTime: number = 0;
  clock: THREE.Clock;
  textures: THREE.Texture[] = [];

  constructor({
    width,
    height,
    scene,
    camera,
  }: {
    width: number;
    height: number;
    scene: THREE.Scene;
    camera: THREE.Camera;
  }) {
    super();
    this.scene = scene;
    this.camera = camera;

    this.material = new PencilLinesMaterial();
    this.fsQuad = new FullScreenQuad(this.material);

    const normalBuffer = new THREE.WebGLRenderTarget(width, height);

    normalBuffer.texture.format = THREE.RGBAFormat;
    normalBuffer.texture.type = THREE.HalfFloatType;
    normalBuffer.texture.minFilter = THREE.NearestFilter;
    normalBuffer.texture.magFilter = THREE.NearestFilter;
    normalBuffer.texture.generateMipmaps = false;
    normalBuffer.stencilBuffer = false;
    this.normalBuffer = normalBuffer;

    this.normalMaterial = new THREE.MeshNormalMaterial();

    this.material.uniforms.uResolution.value = new THREE.Vector2(width, height);

    const loader = new THREE.TextureLoader();
    loader.load("/textures/color-noise.png", (texture) => {
      this.textures.push(texture);
    });
    // loader.load("/textures/color-noise3.jpeg", (texture) => {
    //   this.textures.push(texture);
    // });
    // loader.load("/textures/color-noise2.png", (texture) => {
    //   this.material.uniforms.uTexture.value = texture;
    //   this.textures.push(texture);
    // });

    this.clock = new THREE.Clock();
  }

  dispose() {
    this.material.dispose();
    this.fsQuad.dispose();
  }

  render(
    renderer: THREE.WebGLRenderer,
    writeBuffer: THREE.WebGLRenderTarget,
    readBuffer: THREE.WebGLRenderTarget
  ) {
    const elapsedTime = this.clock.getElapsedTime();
    const deltaTime = elapsedTime - this.previousTime;

    if (deltaTime > 1 / 2) {
      this.previousTime = elapsedTime;
      this.material.uniforms.uTexture.value =
        this.textures[Math.floor(Math.random() * this.textures.length)];
    }

    renderer.setRenderTarget(this.normalBuffer);
    const overrideMaterialValue = this.scene.overrideMaterial;

    this.scene.overrideMaterial = this.normalMaterial;
    renderer.render(this.scene, this.camera);
    this.scene.overrideMaterial = overrideMaterialValue;

    if (this.renderToScreen) {
      renderer.setRenderTarget(null);
      this.fsQuad.render(renderer);
    } else {
      renderer.setRenderTarget(writeBuffer);
      if (this.clear) renderer.clear();
      this.fsQuad.render(renderer);
    }
  }
}
