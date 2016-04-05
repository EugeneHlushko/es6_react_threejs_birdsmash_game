import THREE from 'three';
import debug from 'debug';

class Ground {
  constructor() {
    const groundGeo = new THREE.PlaneBufferGeometry(12000, 12000);
    this.images = {
      grassy: {},
      desert: {}
    };

    for (const [ key ] of Object.entries(this.images)) {
      let tempUrl = require(`images/textures/ground/${ key }_01.png`);
      tempUrl = tempUrl.substring(tempUrl.indexOf('/assets/'));
      this.images[key].url = tempUrl;
    }

    // load a resource
    const defaultTexture = new THREE.TextureLoader().load(this.images.grassy.url);
    defaultTexture.wrapS = THREE.RepeatWrapping;
    defaultTexture.wrapT = THREE.RepeatWrapping;
    defaultTexture.repeat.set(40, 40);
    const floorMaterial = new THREE.MeshBasicMaterial({ map: defaultTexture, side: THREE.DoubleSide });
    //groundMat.color.setHSL(0.095, 1, 0.75);
    this.ground = new THREE.Mesh(groundGeo, floorMaterial);
    this.ground.fog = true;
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.position.y = -30;
    this.ground.receiveShadow = true;
    debug('dev')('test');
    debug('dev')(this.ground);
  }

  setEnv = (pic) => {
    const currentPic = (this.images[pic]) ? this.images[pic].url : this.images.grassy.url;
    const floorTexture = new THREE.TextureLoader().load(currentPic);
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(40, 40);
    this.ground.material.map = floorTexture;
    this.ground.material.needsUpdate = true;
  }
}
export default Ground;
