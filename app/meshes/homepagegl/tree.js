import THREE from 'three';

export default class Tree {
  constructor() {
    this.geoHeight = 10;
    this.geometry = new THREE.CylinderGeometry(
      4, // radius top
      4, // radius bottom
      this.geoHeight, // height
      8 // radius segments
    );
    this.material = new THREE.MeshPhongMaterial({
      color: 0x483000,
      specular: 0x483000,
      shininess: 20,
      morphTargets: true,
      vertexColors: THREE.FaceColors,
      shading: THREE.FlatShading });
    this.cylinder = new THREE.Mesh(this.geometry, this.material);

    this.greenHeight = 60;
    this.greenGeometry = new THREE.CylinderGeometry(
      0, // radius top
      30, // radius bottom
      this.greenHeight, // height
      32 // radius segments
    );
    this.greenMaterial = new THREE.MeshPhongMaterial({
      color: 0x3BA200,
      specular: 0x3BA200,
      shininess: 20,
      morphTargets: true,
      vertexColors: THREE.FaceColors,
      shading: THREE.FlatShading });
    this.green = new THREE.Mesh(this.greenGeometry, this.greenMaterial);
  }

  createSpawn(far, positionX) {
    const temporaryTree = new THREE.Group();
    const cylinder = this.cylinder.clone();
    // ground is positioned on Y axis -30, based on that we put item on the floor with formula
    cylinder.position.y = -(30 - this.geoHeight / 2);
    temporaryTree.add(cylinder);

    const green = this.green.clone();
    green.position.y = 10;
    temporaryTree.add(green);

    temporaryTree.position.z = far;
    temporaryTree.position.x = positionX;

    return temporaryTree;
  }
}
