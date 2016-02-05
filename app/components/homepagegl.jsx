import debug from 'debug';
import React, { Component, PropTypes } from 'react';
import THREE from 'three';
import KeyboardState from 'helpers/keyboardstate';
import FlamingoModel from 'models/flamingo';
import fragmentShader from 'shaders/homepagefrag';
import vertexShader from 'shaders/homepagevert';

class Homepagegl extends Component {

  static contextTypes = {
    flux: PropTypes.object.isRequired,
    i18n: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { flux, i18n } = this.context;

    return flux.getActions('helmet').update({
      title: i18n('homepage.page-title'),
      description: i18n('homepage.page-description')
    });
  }

  componentDidMount() {
    if (process.env.BROWSER) {
      setTimeout(() => this.setup(), 1);
    }
  }

  // initialize stuff here, store variables in this context so they are
  // globally accessible in the component
  setup() {
    this.clock = new THREE.Clock();
    this.camera = new THREE.PerspectiveCamera(
      30,
      window.innerWidth / window.innerHeight,
      1,
      5000
    );
    this.camera.position.set(0, 25, 250);
    this.camera.rotation.x = -0.1;
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0xffffff, 1, 5000);
    this.scene.fog.color.setHSL(0.6, 0, 1);
    this.mixers = [];
    this.trees = [];
    this.collidable = [];
    this.spawnerInterval = null;
    this.cfg = {
      speed: 1000,
      maxTree: 10,
      destroyLine: 100,
      spawnFar: -3600,
      limitLeft: -120,
      limitRight: 120
    };
    this.keyboard = new KeyboardState();
    this.loader = new THREE.TextureLoader();

    // init stuff
    //this.initControls();
    this.initLights();
    this.initGround();
    this.initSky();
    this.initModel();
    this.initRenderer();

    this.animate();

    // start spawning trees
    this.spawnerInterval = setInterval(() => {
      this._createTree();
      this._createTree();
      this._createTree();
      if (this.randomize(0, 1) === 1) {
        this._createTree();
        this._createTree();
      }
    }, 900);

    debug('dev')('Setup complete!');
  }

  randomize = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  initLights() {
    const d = 50;

    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    this.hemiLight.color.setHSL(0.6, 1, 0.6);
    this.hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    this.hemiLight.position.set(0, 500, 0);
    this.scene.add(this.hemiLight);

    // directional light
    this.dirLight = new THREE.DirectionalLight(0xffffff, 1);
    this.dirLight.color.setHSL(0.1, 1, 0.95);
    this.dirLight.position.set(-1, 1.75, 1);
    this.dirLight.position.multiplyScalar(50);
    this.scene.add(this.dirLight);
    this.dirLight.castShadow = true;
    this.dirLight.shadowMapWidth = 2048;
    this.dirLight.shadowMapHeight = 2048;

    this.dirLight.shadowCameraLeft = -d;
    this.dirLight.shadowCameraRight = d;
    this.dirLight.shadowCameraTop = d;
    this.dirLight.shadowCameraBottom = -d;
    this.dirLight.shadowCameraFar = 3500;
    this.dirLight.shadowBias = -0.0001;
    // comment out if needed;
    //this.dirLight.shadowCameraVisible = true;
  }

  // GROUND
  initGround() {
    const groundGeo = new THREE.PlaneBufferGeometry(10000, 10000);
    //let groundMat = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x050505 });
    let grassPicture = require('images/textures/ground/grassy_01.jpg');
    grassPicture = grassPicture.substring(grassPicture.indexOf('/assets/'));

    // load a resource
    /*eslint-disable */
    const floorTexture = new THREE.ImageUtils.loadTexture(grassPicture);
    /*eslint-enable */
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(10, 10);
    const floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
    //groundMat.color.setHSL(0.095, 1, 0.75);
    this.ground = new THREE.Mesh(groundGeo, floorMaterial);
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.position.y = -30;
    this.scene.add(this.ground);
    this.ground.receiveShadow = true;
  }

  // sky
  initSky() {
    const uniforms = {
      topColor: { type: 'c', value: new THREE.Color(0x0077ff) },
      bottomColor: { type: 'c', value: new THREE.Color(0xffffff) },
      offset: { type: 'f', value: 33 },
      exponent: { type: 'f', value: 0.6 }
    };
    uniforms.topColor.value.copy(this.hemiLight.color);
    this.scene.fog.color.copy(uniforms.bottomColor.value);
    const skyGeo = new THREE.SphereGeometry(4000, 32, 15);
    const skyMat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      side: THREE.BackSide
    });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    this.scene.add(sky);
  }

  initModel = () => {
    this.flamingoGroup = new THREE.Group();
    this.JSONloader = new THREE.JSONLoader();
    this.Flamingo = this.JSONloader.parse(FlamingoModel);
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      specular: 0xffffff,
      shininess: 20,
      morphTargets: true,
      vertexColors: THREE.FaceColors,
      shading: THREE.FlatShading });

    this.FlamingoMesh = new THREE.Mesh(this.Flamingo.geometry, material);
    const s = 0.35;
    this.FlamingoMesh.scale.set(s, s, s);
    this.FlamingoMesh.position.y = 5;
    this.FlamingoMesh.position.z = 5;
    this.FlamingoMesh.rotation.y = -3.15;
    //this.FlamingoMesh.rotation.z = -1;
    this.FlamingoMesh.castShadow = true;
    this.FlamingoMesh.receiveShadow = true;

    const flamingoCube = new THREE.BoxGeometry(40, 40, 40);
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.FlamingoCube = new THREE.Mesh(flamingoCube, cubeMaterial);
    this.FlamingoCube.position.y = -20;
    this.flamingoGroup.add(this.FlamingoMesh);
    this.flamingoGroup.add(this.FlamingoCube);
    this.scene.add(this.flamingoGroup);

    const mixer = new THREE.AnimationMixer(this.FlamingoMesh);
    mixer.addAction(
      new THREE.AnimationAction(this.Flamingo.geometry.animations[0]).warpToDuration(1)
    );
    this.mixers.push(mixer);
  }

  initRenderer() {
    // RENDERER
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor(this.scene.fog.color);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    debug('dev')(this);
    this.refs.canvasHolder.appendChild(this.renderer.domElement);
    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.cullFace = THREE.CullFaceBack;
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    this.update();
    //stats.update();
  }

  update = () => {
    const delta = this.clock.getDelta();
    // update animation of the flamingo
    for (let i = 0; i < this.mixers.length; i++) {
      this.mixers[i].update(delta);
    }
    // famove trees
    for (let i = 0; i < this.trees.length; i++) {
      this.trees[i].position.z += (delta * this.cfg.speed);
      if (this.trees[i].position.z > this.cfg.destroyLine) {
        // remove the tree and its references
        this.scene.remove(this.trees[i]);
        this.collidable.splice(i, 1);
        this.trees.splice(i, 1);
      }
    }

    // ground move
    this.ground.position.z += (delta * this.cfg.speed);
    if (this.ground.position.z > 1400) {
      this.ground.position.z = 0;
    }

    // controls of the player
    if (this.keyboard.pressed('left')) {
      if (this.flamingoGroup.position.x > this.cfg.limitLeft) {
        this.flamingoGroup.position.x -= 1.5;
      }
      if (this.flamingoGroup.rotation.z < 0.24) {
        this.flamingoGroup.rotation.z += 0.01;
      }
    }
    if (this.keyboard.pressed('right')) {
      if (this.flamingoGroup.position.x < this.cfg.limitRight) {
        this.flamingoGroup.position.x += 1.5;
      }
      if (this.flamingoGroup.rotation.z > -0.24) {
        this.flamingoGroup.rotation.z -= 0.01;
      }
    }
    // rotation back when keys are released
    if (!this.keyboard.pressed('left') && !this.keyboard.pressed('right')) {
      if (this.flamingoGroup.rotation.z < 0) {
        this.flamingoGroup.rotation.z += 0.01;
      } else if (this.flamingoGroup.rotation.z > 0) {
        this.flamingoGroup.rotation.z -= 0.01;
      }
    }

    // collision detection
    const originPoint = this.FlamingoCube.clone();

    for (let vertexIndex = 0; vertexIndex < this.FlamingoCube.geometry.vertices.length; vertexIndex++) {
      const localVertex = this.FlamingoCube.geometry.vertices[vertexIndex].clone();
      const globalVertex = localVertex.applyMatrix4(this.FlamingoCube.matrix);
      const directionVector = globalVertex.sub(this.FlamingoCube.position);

      const ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
      const collisionResults = ray.intersectObjects(this.collidable);
      if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
        debug('dev')('COLLISION!!!!!');
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  render() {
    //const { i18n } = this.context;
    return (
      <div ref='canvasHolder' className='canvasHolder'></div>
      );
  }

  // this will spawn a tree into the scene at random horizontal position for player to avoid
  // tree gets destroyed after it leaves the scene
  _createTree = () => {
    const temporaryTree = new THREE.Group();
    const geoHeight = 10;
    const geometry = new THREE.CylinderGeometry(
      4, // radius top
      4, // radius bottom
      geoHeight, // height
      8 // radius segments
    );
    const material = new THREE.MeshPhongMaterial({
      color: 0x483000,
      specular: 0x483000,
      shininess: 20,
      morphTargets: true,
      vertexColors: THREE.FaceColors,
      shading: THREE.FlatShading });
    const cylinder = new THREE.Mesh(geometry, material);
    cylinder.position.y = -(30 - geoHeight / 2);
    temporaryTree.add(cylinder);

    const greenHeight = 60;
    const greenGeometry = new THREE.CylinderGeometry(
      0, // radius top
      30, // radius bottom
      greenHeight, // height
      32 // radius segments
    );
    const greenMaterial = new THREE.MeshPhongMaterial({
      color: 0x3BA200,
      specular: 0x3BA200,
      shininess: 20,
      morphTargets: true,
      vertexColors: THREE.FaceColors,
      shading: THREE.FlatShading });
    const green = new THREE.Mesh(greenGeometry, greenMaterial);
    green.position.y = 10;
    this.collidable.push(green);
    temporaryTree.add(green);
    // now randomize x position
    temporaryTree.position.z = this.cfg.spawnFar;
    temporaryTree.position.x = this.randomize(-500, 500);

    this.trees.push(temporaryTree);
    this.scene.add(temporaryTree);
  }

}

export default Homepagegl;
