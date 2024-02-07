import {
  BufferGeometry,
  Float32BufferAttribute,
  SkeletonHelper,
  SkinnedMesh,
  Uint16BufferAttribute,
  Vector3,
} from "three";
import { SceneMesh } from "./SceneMesh";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

export class ArbitraryHead extends SceneMesh {
  boneCenterX;
  boneCenterZ;
  constructor(scene) {
    super(scene);

    const gltfLoader = new GLTFLoader();

    gltfLoader.load("/models/hej/Godtyckligt_huvud.glb", this.onLoad);
  }

  onLoad = (gltf: GLTF) => {
    this.geometry = this.generateGeometry(gltf);
    this.skeleton = this.generateSkeleton();
    this.mesh = new SkinnedMesh(this.geometry, this.material);

    this.skeleton.bones[0].position.x = this.boneCenterX;
    //this.skeleton.bones[0].position.z = this.boneCenterZ;

    this.mesh.add(this.skeleton.bones[0]);
    this.mesh.bind(this.skeleton);
    this.scene.add(this.mesh);
    // this.helper = new SkeletonHelper(this.mesh);
    // this.scene.add(this.helper);
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

    mergedChildrenGeometry.rotateX(Math.PI / 2);
    mergedChildrenGeometry.rotateY(-Math.PI / 6);

    mergedChildrenGeometry.computeBoundingBox();
    const box1 = mergedChildrenGeometry.boundingBox;

    const currentHeight = (box1?.max.y ?? 0) - (box1?.min.y ?? 0);

    const scale = this.targetHeight / currentHeight;
    mergedChildrenGeometry.scale(scale, scale, scale);
    mergedChildrenGeometry.translate(0, 0.3010241985321045, 0);
    mergedChildrenGeometry.computeBoundingBox();
    const box2 = mergedChildrenGeometry.boundingBox;

    const boxCenter = new Vector3();
    box2?.getCenter(boxCenter);
    this.boneCenterX = boxCenter.x;
    this.boneCenterZ = boxCenter.z;
    console.log(this.boneCenterX);
    console.log(this.boneCenterZ);

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
