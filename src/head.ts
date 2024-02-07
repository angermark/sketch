import {
  BufferGeometry,
  Float32BufferAttribute,
  Scene,
  SkeletonHelper,
  SkinnedMesh,
  Uint16BufferAttribute,
  Vector3,
} from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { SceneMesh } from "./SceneMesh";

export class Head extends SceneMesh {
  constructor(scene: Scene) {
    super(scene);
    const gltfLoader = new GLTFLoader();

    gltfLoader.load("/models/Head/hunter_bust/scene.gltf", this.onLoad);
  }

  onLoad = (gltf: GLTF) => {
    this.geometry = this.generateGeometry(gltf);
    this.skeleton = this.generateSkeleton();
    this.mesh = new SkinnedMesh(this.geometry, this.material);
    this.mesh.add(this.skeleton.bones[0]);
    this.mesh.bind(this.skeleton);
    const helper = new SkeletonHelper(this.skeleton.bones[0]);
    helper.geometry.computeBoundingBox();
    console.log(helper.material);
    this.scene.add(this.skeleton.bones[0]);
    this.scene.add(helper);
    this.scene.add(this.mesh);
  };

  generateGeometry = (gltf: GLTF) => {
    const children: BufferGeometry[] = [];
    gltf.scene.traverse((child: any) => {
      if (child.isMesh) {
        children.push(child.geometry);
      }
    });
    const mergedChildrenGeometry = mergeGeometries(children);
    const { position } = mergedChildrenGeometry.attributes;
    const vertex = new Vector3();

    const scale = 0.01732159578;
    mergedChildrenGeometry.scale(scale, scale, scale);
    mergedChildrenGeometry.rotateX(-Math.PI / 2);
    mergedChildrenGeometry.translate(0, 1.1818386316299438, 0);

    mergedChildrenGeometry.computeBoundingBox();
    const box = mergedChildrenGeometry.boundingBox;

    console.log(box);
    const skinIndices: number[] = [];
    const skinWeights: number[] = [];

    for (let i = 0; i < position.count; i++) {
      vertex.fromBufferAttribute(position, i);

      // compute skinIndex and skinWeight based on some configuration data
      const y = vertex.y + this.targetHeight / 2;
      const skinIndex = Math.floor(
        Math.min(y / this.segmentHeight, this.segmentCount - 1)
      );
      const skinWeight = 0;
      skinIndices.push(skinIndex, 1, 0, 0);
      skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
    }

    mergedChildrenGeometry.setAttribute(
      "skinIndex",
      new Uint16BufferAttribute(skinIndices, 4)
    );
    mergedChildrenGeometry.setAttribute(
      "skinWeight",
      new Float32BufferAttribute(skinWeights, 4)
    );

    return mergedChildrenGeometry;
  };
}
