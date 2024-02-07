import {
  Bone,
  CylinderGeometry,
  Float32BufferAttribute,
  MeshPhongMaterial,
  Skeleton,
  SkeletonHelper,
  SkinnedMesh,
  Uint16BufferAttribute,
  Vector3,
} from "three";
import { SceneMesh } from "./SceneMesh";

export class BouncyCylinder extends SceneMesh {
  mesh: SkinnedMesh;
  geometry: CylinderGeometry;
  nOfBones: number = 5;
  boneSize: number = 1;
  size: number = this.nOfBones * this.boneSize;
  skeleton: Skeleton;
  material = new MeshPhongMaterial({
    color: "midnightblue",
    flatShading: true,
    shininess: 150,
    wireframe: true,
  });
  constructor(scene) {
    super(scene);
    this.skeleton = this.generateSkeleton();
    this.geometry = this.generateGeometry();

    this.mesh = new SkinnedMesh(this.geometry, this.material);

    this.mesh.add(this.skeleton.bones[0]);
    this.mesh.bind(this.skeleton);
    this.mesh.position.x = this.size / 10;

    //scene.add(this.mesh);
    const helper = new SkeletonHelper(this.mesh);
    scene.add(helper);
    console.log(helper.material);
  }

  update = (time: number) => {
    for (let i = 0; i < this.mesh.skeleton.bones.length; i++) {
      this.mesh.skeleton.bones[i].rotation.z =
        (Math.sin(time) * 2) / this.mesh.skeleton.bones.length;
    }
  };

  generateSkeleton = () => {
    const bones: Bone[] = [];

    for (let i = 0; i <= this.nOfBones; i++) {
      bones[i] = new Bone();
      if (i) {
        bones[i - 1].add(bones[i]);
        bones[i].position.y = i ? this.boneSize : -this.size;
      }
    }
    return new Skeleton(bones);
  };

  generateGeometry = () => {
    const geometry = new CylinderGeometry(5, 5, 5, 5, 15, undefined, 30);

    const position = geometry.attributes.position;

    const vertex = new Vector3();

    const skinIndices: number[] = [];
    const skinWeights: number[] = [];

    for (let i = 0; i < position.count; i++) {
      vertex.fromBufferAttribute(position, i);

      // compute skinIndex and skinWeight based on some configuration data
      const y = vertex.y + this.size / 2;
      const skinIndex = Math.floor(y / this.boneSize);
      const skinWeight = (y % this.boneSize) / this.boneSize;
      skinIndices.push(skinIndex, skinIndex + 1, 0, 0);
      skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
    }

    geometry.setAttribute(
      "skinIndex",
      new Uint16BufferAttribute(skinIndices, 4)
    );
    geometry.setAttribute(
      "skinWeight",
      new Float32BufferAttribute(skinWeights, 4)
    );

    return geometry;
  };
}
