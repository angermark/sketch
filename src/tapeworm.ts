import * as THREE from "three";

export class Tapeworm {
  n = 20;
  boneSize = 10;
  size = this.n * this.boneSize;

  geometry: THREE.SphereGeometry;
  //Skeleton
  skeleton: THREE.Skeleton;
  //Skin
  skinIndices: number[] = [];
  skinWeights: number[] = [];
  material = new THREE.MeshPhongMaterial({
    color: "midnightblue",
    flatShading: true,
    shininess: 150,
  });
  tapeworm: THREE.SkinnedMesh;

  constructor(scene: THREE.Scene) {
    this.skeleton = this.generateSkeleton();
    this.geometry = this.generateGeometry();

    this.tapeworm = new THREE.SkinnedMesh(this.geometry, this.material);

    this.tapeworm.add(this.skeleton.bones[0]);
    this.tapeworm.bind(this.skeleton);
    this.tapeworm.position.x = this.size / 10;

    scene.add(this.tapeworm);
  }

  update = (time: number) => {
    // tapeworm motion

    this.tapeworm.rotation.z = -0.1 * Math.cos(1.9 * time);
    this.tapeworm.position.y = -10.2 * Math.cos(1.9 * time);

    for (var i = 1; i <= this.n; i++) {
      this.skeleton.bones[i].rotation.x = THREE.MathUtils.degToRad(
        i * 1 * Math.cos(0.2 * time + i * i)
      );
      this.skeleton.bones[i].rotation.z = THREE.MathUtils.degToRad(
        i * 5 * Math.sin(1.9 * time - i)
      );
    }

    this.skeleton.bones[0].rotation.z = THREE.MathUtils.degToRad(
      20 * Math.cos((1.9 / 2) * time)
    );
    this.skeleton.bones[1].rotation.z = -this.skeleton.bones[0].rotation.z / 2;
    this.skeleton.bones[2].rotation.z = -this.skeleton.bones[0].rotation.z / 2;
  };

  generateSkeleton = () => {
    const bones: THREE.Bone[] = [];

    for (let i = 0; i <= this.n; i++) {
      bones[i] = new THREE.Bone();
      if (i) bones[i - 1].add(bones[i]);
      bones[i].position.x = i ? this.boneSize : -this.size / 2;
    }
    return new THREE.Skeleton(bones);
  };

  generateGeometry = () => {
    const geometry = new THREE.SphereGeometry(
      this.size / 2,
      60,
      120,
      0,
      Math.PI
    )
      .rotateZ(Math.PI / 4)
      .scale(1, 0.07, 0.02);
    console.log(geometry);
    const pos = geometry.getAttribute("position");
    console.log(pos.count);
    for (var i = 0; i < pos.count; i++) {
      const x = pos.getX(i) + this.size / 2;
      const bone = Math.floor(Math.min(x / this.boneSize, this.n));
      const k = (x / this.boneSize) % 1;

      const cos = Math.cos(((Math.PI * 2) / 3) * (k - 0.5));

      if (k < 0.5) this.skinIndices.push(bone, Math.max(bone - 1, 0), 0, 0);
      else this.skinIndices.push(bone, Math.min(bone + 1, this.n), 0, 0);
      this.skinWeights.push(cos, 1 - cos, 0, 0);
    }
    geometry.setAttribute(
      "skinIndex",
      new THREE.Uint16BufferAttribute(this.skinIndices, 4)
    );
    geometry.setAttribute(
      "skinWeight",
      new THREE.Float32BufferAttribute(this.skinWeights, 4)
    );

    return geometry;
  };
}
