import debug from 'debug';

class GameStore {

  constructor() {
    this.bindActions(this.alt.getActions('game'));
    this.isPlaying = false;
  }

  onInitialize() {
    debug('dev')('initializing new game');
    this.health = 3;
    this.score = 0;
    this.level = 1;
    this.levelSwitchCount = 10;
    this.paused = false;
    this.gameOver = false;
    this.isPlaying = true;
    this.ticks = 0;
    this.envs = {
      types: [ 'grassy', 'desert' ],
      current: 0,
      switchMark: 10,
      switchNeed: false
    };
  }

  onEnd() {
    debug('dev')('Game is over, lets end it');
    this.gameOver = true;
    this.isPlaying = false;
  }

  onChangeEnvStart() {
    debug('dev')('Game environment will be changed, PAUSE!');
    this.envs.switchNeed = false;
    this.paused = true;
  }

  onChangeEnvEnd() {
    debug('dev')('Game environment has changed! Unpausing');
    this.paused = false;
  }

  onSetScore(trees) {
    this.score = this.score + (trees * this.level * 10);
    this.ticks++;
    // increase level each 16 ticks
    if ((this.ticks / this.level) > this.levelSwitchCount) {
      this.level++;
      if (this.level === this.envs.switchMark * (this.level / this.envs.switchMark)) {
        this.envs.current++;
        this.envs.switchNeed = true;
      }
    }
  }

  onReduceLives() {
    if (this.health > 1) {
      this.health--;
    } else {
      this.health = 0;
      this.gameOver = true;
      this.isPlaying = false;
    }
  }
}

export default GameStore;
