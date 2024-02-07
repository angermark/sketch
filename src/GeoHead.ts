import {
  BufferGeometry,
  CylinderGeometry,
  Float32BufferAttribute,
  NormalBufferAttributes,
  Scene,
  SkinnedMesh,
  SphereGeometry,
  Uint16BufferAttribute,
  Vector3,
} from "three";
import { SceneMesh } from "./SceneMesh";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

export class GeoHead extends SceneMesh {
  constructor(scene: Scene) {
    super(scene);
    this.geometry = this.generateGeometry();
    this.skeleton = this.generateSkeleton();
    this.mesh = new SkinnedMesh(this.geometry, this.material);
    this.mesh.add(this.skeleton.bones[0]);
    this.mesh.bind(this.skeleton);
    this.scene.add(this.mesh);
  }

  generateGeometry = () => {
    const children: BufferGeometry[] = [];

    const neck = new CylinderGeometry(1, 1, 5, 10, 100);
    neck.rotateX(Math.PI / 2);
    children.push(neck);
    const head = new SphereGeometry(2);
    head.translate(0, 0, 4);
    children.push(head);
    const shoulders = new CylinderGeometry(1, 1, 7, 10, 100);
    shoulders.rotateZ(Math.PI / 2);
    shoulders.translate(0, 0, -2);
    children.push(shoulders);

    const mergedChildrenGeometry = mergeGeometries(children);

    return this.computeSkin(mergedChildrenGeometry);
  };

  computeSkin(
    geometry: BufferGeometry<NormalBufferAttributes>
  ): BufferGeometry<NormalBufferAttributes> {
    const { position } = geometry.attributes;
    const vertex = new Vector3();

    const scale = 1;
    geometry.scale(scale, scale, scale);
    geometry.rotateX(-Math.PI / 2);

    geometry.computeBoundingBox();
    const box = geometry.boundingBox;

    const skinIndices: number[] = [];
    const skinWeights: number[] = [];

    for (let i = 0; i < position.count; i++) {
      vertex.fromBufferAttribute(position, i);

      // compute skinIndex and skinWeight based on some configuration data

      //   console.log(vertex.y);
      //   console.log(this.height / 2);
      //   console.log(this.segmentCount);

      const y = vertex.y + this.targetHeight / 2;

      const skinIndex = Math.floor(
        Math.min(y / this.segmentHeight, this.segmentCount - 1)
      );

      const skinWeight = 0;
      skinIndices.push(skinIndex, 1, 0, 0);
      skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
    }

    console.log(skinWeights);

    geometry.setAttribute(
      "skinIndex",
      new Uint16BufferAttribute(skinIndices, 4)
    );
    geometry.setAttribute(
      "skinWeight",
      new Float32BufferAttribute(skinWeights, 4)
    );
    return geometry;
  }
}
