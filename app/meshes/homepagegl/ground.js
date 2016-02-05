import THREE from 'three';
class Ground {
  constructor() {
    const groundGeo = new THREE.PlaneBufferGeometry(12000, 12000);
    //let groundMat = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x050505 });
    let grassPicture = require('images/textures/ground/grassy_01.jpg');
    grassPicture = grassPicture.substring(grassPicture.indexOf('/assets/'));

    // load a resource
    /*eslint-disable */
    const floorTexture = new THREE.ImageUtils.loadTexture(grassPicture);
    /*eslint-enable */
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(40, 40);
    const floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
    //groundMat.color.setHSL(0.095, 1, 0.75);
    this.ground = new THREE.Mesh(groundGeo, floorMaterial);
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.position.y = -30;
    this.ground.receiveShadow = true;
  }
}
export default Ground;
