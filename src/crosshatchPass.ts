import { FullScreenQuad, Pass } from "three/examples/jsm/postprocessing/Pass";
import { CrosshatchMaterial } from "./crosshatchMaterial";
import * as THREE from "three";
import { PassProps } from "./types";

export class CrosshatchPass extends Pass {
  material: CrosshatchMaterial;
  fsQuad: FullScreenQuad;
  normalBuffer: THREE.WebGLRenderTarget;
  normalMaterial: THREE.MeshNormalMaterial;
  scene;
  camera;
  noiseTexture: THREE.Texture;
  previousTime: number = 0;
  clock: THREE.Clock;
  tRes: THREE.Vec2 = new THREE.Vector2(0, 0);
  constructor({ width, height, scene, camera }: PassProps) {
    super();
    this.scene = scene;
    this.camera = camera;

    this.material = new CrosshatchMaterial();
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
    loader.load("/textures/final_noise.png", (texture) => {
      this.noiseTexture = texture;
      this.material.uniforms.uTexture.value = this.noiseTexture;
      this.material.uniforms.uTexture.value.wrapS =
        this.material.uniforms.uTexture.value.wrapT = THREE.RepeatWrapping;
      this.material.uniforms.uTexture.value.minFilter =
        THREE.LinearMipMapNearestFilter;
    });

    this.clock = new THREE.Clock();
  }

  dispose() {
    this.material.dispose();
    this.fsQuad.dispose();
  }

  render(
    renderer: THREE.WebGLRenderer,
    writeBuffer: THREE.WebGLRenderTarget<THREE.Texture>,
    readBuffer: THREE.WebGLRenderTarget<THREE.Texture>
  ): void {
    const elapsedTime = this.clock.getElapsedTime();
    const deltaT = elapsedTime - this.previousTime;

    // render at ~24 fps
    if (deltaT > 1 / 24) {
      // update time
      this.previousTime = elapsedTime;

      // render scene
      renderer.setRenderTarget(this.normalBuffer);
      const overrideMaterialValue = this.scene.overrideMaterial;
      this.scene.overrideMaterial = this.normalMaterial;
      renderer.render(this.scene, this.camera);
      this.scene.overrideMaterial = overrideMaterialValue;

      // postprocessing
      this.material.uniforms.uNormals.value = this.normalBuffer.texture;
      this.material.uniforms.uTime.value = this.clock.getElapsedTime();
      renderer.setRenderTarget(null);
      this.fsQuad.render(renderer);
    }
  }
}
