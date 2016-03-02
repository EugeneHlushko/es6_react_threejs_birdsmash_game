import debug from 'debug';
import React, { Component, PropTypes } from 'react';
import GameStats from 'components/shared/game-stats';
import connect from 'connect-alt';
//import THREE from 'three';
import THREE from 'helpers/GPUparticles';
import KeyboardState from 'helpers/keyboardstate';

// Shaders
import fragmentShader from 'shaders/homepagefrag';
import vertexShader from 'shaders/homepagevert';

// Meshes
import Ground from 'meshes/homepagegl/ground';
import Flamingo from 'meshes/homepagegl/flamingo';
import Tree from 'meshes/homepagegl/tree';
import Pyramid from 'meshes/homepagegl/pyramid';

@connect(({ game }) => ({ game }))
@connect(({ session: { session } }) => ({ session }))
class Birdsmash extends Component {

  static contextTypes = {
    flux: PropTypes.object.isRequired,
    i18n: PropTypes.func.isRequired
  }

  static propTypes = {
    game: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired
  }

  componentWillMount() {
    const { flux, i18n } = this.context;

    // initialize new game
    flux.getActions('game').initialize();

    this.state = {};

    return flux.getActions('helmet').update({
      title: i18n('homepage.page-title'),
      description: i18n('homepage.page-description')
    });
  }

  componentWillUnmount() {
    const { flux } = this.context;
    const { game, session } = this.props;

    flux.getActions('game').end();
    flux.getActions('highscores').add(game.score, session.username);

    cancelAnimationFrame(this.animationFrame);
    this.scene = null;
    this.renderer = null;
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
    this.obstacles = [];
    this.animationFrame = null;
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
    // used to spawn obstacles
    // changed with level change to new obstacles
    this.state.spawner = new Tree();
    //this.spawner = new Tree();
    //this.spawner = new Pyramid();
    debug('dev')(Tree);

    // init stuff
    //this.initControls();
    this.initLights();
    this.initGround();
    this.initSky();
    this.initModel();
    this.initRenderer();

    this.particleSystem = new THREE.GPUParticleSystem({
      maxParticles: 250000
    });
    this.scene.add(this.particleSystem);

    // options passed during each spawned
    this.particleOptions = {
      position: new THREE.Vector3(),
      positionRandomness: 25,
      velocity: new THREE.Vector3(),
      velocityRandomness: 100,
      color: 0xff5300,
      colorRandomness: 0.2,
      turbulence: 5,
      lifetime: 1,
      size: 100,
      sizeRandomness: 10
    };

    this.spawnerOptions = {
      spawnRate: 15000,
      horizontalSpeed: 1.5,
      verticalSpeed: 1.33,
      timeScale: 1
    };
    this.tick = 0;

    this.animate();

    debug('dev')('Setup complete!');
  }

  randomize = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  initLights() {
    const d = 150;

    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    this.hemiLight.color.setHSL(0.6, 1, 0.6);
    this.hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    this.hemiLight.position.set(0, 500, 0);
    this.scene.add(this.hemiLight);

    // directional light
    this.dirLight = new THREE.DirectionalLight(0xffffff, 1);
    this.dirLight.color.setHSL(0.1, 1, 0.95);
    this.dirLight.position.set(-1, 1.75, -1.5);
    this.dirLight.rotation.z = 1;
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
    this.groundHolder = new Ground();
    this.ground = this.groundHolder.ground;
    this.scene.add(this.ground);
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
    this.Flamingo = new Flamingo();
    this.scene.add(this.Flamingo.group);

    const mixer = new THREE.AnimationMixer(this.Flamingo.mesh);
    mixer.addAction(
      new THREE.AnimationAction(this.Flamingo.model.geometry.animations[0]).warpToDuration(1)
    );
    this.mixers.push(mixer);
  }

  initRenderer() {
    // RENDERER
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor(this.scene.fog.color);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.refs.canvasHolder.appendChild(this.renderer.domElement);
    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.cullFace = THREE.CullFaceBack;
  }

  animate = () => {
    const { game } = this.props;
    const { flux } = this.context;

    this.animationFrame = requestAnimationFrame(this.animate);
    // switch level
    if (game.envs.switchNeed) {
      flux.getActions('game').changeEnvStart();
      this.setState({ spawner: new Pyramid() });
      debug('dev')('Switch seems needed, current is ' + game.envs.current);
      this.groundHolder.setEnv(game.envs.types[game.envs.current]);

      flux.getActions('game').changeEnvEnd();

      // call action that we are switching,
      // delay,
      // rotate screen
      // some effects
      // continue game
    }
    if (game.paused) return;
    this.update();
  }

  update = () => {
    const { flux } = this.context;
    const { game } = this.props;

    if (game.isPaused) return false;

    if (game.gameOver) {
      // redirect to game over screen
      const history = require('utils/router-history');
      const url = `/gameover`;
      const [ , nextPath = url ] = [];
      history.replaceState(null, nextPath);
      return false;
    }

    const delta = this.clock.getDelta();
    this.tick += delta;

    if (this.tick < 0) this.tick = 0;

    this.particleSystem.update(this.tick);

    // update animation of the flamingo
    for (let i = 0; i < this.mixers.length; i++) {
      this.mixers[i].update(delta);
    }
    // move trees
    for (let i = 0; i < this.obstacles.length; i++) {
      this.obstacles[i].position.z += (delta * this.cfg.speed + (game.level * 2));
      if (this.obstacles[i].position.z > this.cfg.destroyLine) {
        // remove the tree and its references
        this.scene.remove(this.obstacles[i]);
        this.obstacles.splice(i, 1);
      } else if (this.obstacles[i].position.z < 45 && this.obstacles[i].position.z > -20) {
        // check for collision
        if (Math.abs(this.Flamingo.group.position.x - this.obstacles[i].position.x) < 34) {
          // COLLIDED!
          debug('dev')('COLLISION DETECTED!');
          this.scene.remove(this.obstacles[i]);
          this.obstacles.splice(i, 1);
          // reduce lives, if no more lives, game over;
          flux.getActions('game').reduceLives();

          // make the firework
          if (delta > 0) {
            this.particleOptions.position.x = this.Flamingo.group.position.x;
            this.particleOptions.position.y = this.Flamingo.group.position.y;
            this.particleOptions.position.z = this.Flamingo.group.position.z;

            for (let x = 0; x < this.spawnerOptions.spawnRate * delta; x++) {
              // Yep, that's really it.	Spawning particles is super cheap, and once you spawn them, the rest of
              // their lifecycle is handled entirely on the GPU, driven by a time uniform updated below
              this.particleSystem.spawnParticle(this.particleOptions);
            }
          }
        }
      }
    }

    // ground move && spawn trees
    this.ground.position.z += (delta * this.cfg.speed + (game.level * 2));
    if (this.ground.position.z > 1200) {
      this.ground.position.z = 0;
      const bonusTrees = this.randomize(0, 3);
      let howManyTrees = 3 + bonusTrees;
      // update game score
      flux.getActions('game').setScore(howManyTrees);
      while (howManyTrees > 0) {
        this._createSpawn();
        howManyTrees--;
      }
    }

    // controls of the player
    if (this.keyboard.pressed('left')) {
      if (this.Flamingo.group.position.x > this.cfg.limitLeft) {
        this.Flamingo.group.position.x -= 1.5;
      }
      if (this.Flamingo.group.rotation.z < 0.24) {
        this.Flamingo.group.rotation.z += 0.01;
      }
    }
    if (this.keyboard.pressed('right')) {
      if (this.Flamingo.group.position.x < this.cfg.limitRight) {
        this.Flamingo.group.position.x += 1.5;
      }
      if (this.Flamingo.group.rotation.z > -0.24) {
        this.Flamingo.group.rotation.z -= 0.01;
      }
    }
    // rotation back when keys are released
    if (!this.keyboard.pressed('left') && !this.keyboard.pressed('right')) {
      if (this.Flamingo.group.rotation.z < 0) {
        this.Flamingo.group.rotation.z += 0.01;
      } else if (this.Flamingo.group.rotation.z > 0) {
        this.Flamingo.group.rotation.z -= 0.01;
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  render() {
    //const { i18n } = this.context;
    return (
      <div ref='canvasHolder' className='canvasHolder'>
        <GameStats />
      </div>
      );
  }

  // this will spawn a tree into the scene at random horizontal position for player to avoid
  // tree gets destroyed after it leaves the scene
  _createSpawn = () => {
    const temporaryTree = this.state.spawner.createSpawn(this.cfg.spawnFar, this.randomize(-500, 500));
    this.obstacles.push(temporaryTree);
    this.scene.add(temporaryTree);
  }

}

export default Birdsmash;
