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
    this.paused = false;
    this.gameOver = false;
    this.isPlaying = true;
    this.ticks = 0;
  }

  onEnd() {
    debug('dev')('Game is over, lets end it');
    this.gameOver = true;
    this.isPlaying = false;
  }

  onSetScore(trees) {
    this.score = this.score + (trees * this.level * 10);
    this.ticks++;
    // increase level each 16 ticks
    if ((this.ticks / this.level) > 16) {
      this.level++;
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
