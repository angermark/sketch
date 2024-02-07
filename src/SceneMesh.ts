import {
  Bone,
  BufferGeometry,
  MeshPhongMaterial,
  Scene,
  Skeleton,
  SkeletonHelper,
  SkinnedMesh,
} from "three";

export class SceneMesh {
  mesh: SkinnedMesh;
  scene: Scene;
  material = new MeshPhongMaterial({
    color: "green",
    flatShading: true,
    shininess: 150,
    //wireframe: true,
    // transparent: true,
    // opacity: 0,
  });
  skeleton: Skeleton;
  geometry: BufferGeometry;
  segmentCount = 2000;
  targetHeight = 8;
  boneSize = 3 / this.segmentCount;
  segmentHeight = this.targetHeight / this.segmentCount;
  helper: SkeletonHelper;
  constructor(scene: Scene) {
    this.scene = scene;
  }

  generateSkeleton = () => {
    const bones: Bone[] = [];

    for (let i = 0; i < this.segmentCount; i++) {
      bones.push(new Bone());
      if (i) {
        bones[i - 1].add(bones[i]);
        bones[i].position.y = i ? this.boneSize : 0;
        bones[i].position.z = 0.001;
      }
    }

    const skel = new Skeleton(bones);

    return skel;
  };

  update = (time: number, targetY: number, targetX: number) => {
    const xRotationTarget = ((Math.PI / 8) * targetX) / this.segmentCount;
    const yRotationTarget = ((Math.PI / 8) * targetY) / this.segmentCount;
    for (let i = 0; i < this.segmentCount; i++) {
      if (i > this.segmentCount / 2) {
        this.mesh.skeleton.bones[i].rotation.x +=
          (xRotationTarget - this.mesh.skeleton.bones[i].rotation.x) * time * 2;
        this.mesh.skeleton.bones[i].rotation.y +=
          (yRotationTarget - this.mesh.skeleton.bones[i].rotation.y) * time * 2;
      }
    }
  };
}
