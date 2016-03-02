import THREE from 'three';

export default class Pyramid {
  constructor() {
    this.objectHeight = 50;
    this.objectGeometry = new THREE.CylinderGeometry(
      0, // radius top
      30, // radius bottom
      this.objectHeight, // height
      4, // radius segments
      1,
      true
    );
    let sandBrickTexture = require('images/textures/walls/pyramid.jpg');
    sandBrickTexture = sandBrickTexture.substring(sandBrickTexture.indexOf('/assets/'));

    /*eslint-disable */
    this.texture = new THREE.ImageUtils.loadTexture(sandBrickTexture);
    /*eslint-enable */
    this.brickMaterial = new THREE.MeshBasicMaterial({ map: this.texture, side: THREE.DoubleSide });
    this.pyramid = new THREE.Mesh(this.objectGeometry, this.brickMaterial);
  }

  createSpawn(far, positionX) {
    const PyramidMesh = this.pyramid.clone();
    PyramidMesh.position.z = far;
    PyramidMesh.position.x = positionX;

    return PyramidMesh;
  }
}
