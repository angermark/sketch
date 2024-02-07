import * as THREE from "three";
import fragmentShader from "./shaders/pencil/fragment.frag?raw";
import vertexShader from "./shaders/pencil/vertex.vert?raw";
// PencilLinesMaterial.ts
export class PencilLinesMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        // we'll keep the naming convention here since the CopyShader
        // also used a tDiffuse texture for the currently rendered scene.
        tDiffuse: { value: null },
        uNormals: { value: null },
        uTexture: { value: null },
        // we'll pass in the canvas size here later
        uResolution: {
          value: new THREE.Vector2(1, 1),
        },
      },
      fragmentShader, // to be imported from another file
      vertexShader, // to be imported from another file
    });
  }
}
