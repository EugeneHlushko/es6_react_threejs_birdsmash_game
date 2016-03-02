import THREE from 'three';
import FlamingoModel from 'models/flamingo';

class Flamingo {
  constructor() {
    this.JSONloader = new THREE.JSONLoader();
    this.model = this.JSONloader.parse(FlamingoModel);
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      specular: 0xffffff,
      shininess: 20,
      morphTargets: true,
      vertexColors: THREE.FaceColors,
      shading: THREE.FlatShading });

    this.mesh = new THREE.Mesh(this.model.geometry, material);
    const s = 0.35;
    this.mesh.scale.set(s, s, s);
    this.mesh.position.y = 5;
    this.mesh.position.z = 50;
    this.mesh.rotation.y = -3.15;
    //this.mesh.rotation.z = -1;
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    this.group = new THREE.Group();
    this.group.add(this.mesh);
  }
}

export default Flamingo;
