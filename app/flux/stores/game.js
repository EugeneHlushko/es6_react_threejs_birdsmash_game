import debug from 'debug';

class GameStore {

  constructor() {
    this.bindActions(this.alt.getActions('game'));
    this.health = '1';
    this.score = null;
    this.level = null;
    this.paused = null;
    this.isPlaying = null;
  }

  onInitialize() {
    debug('dev')('initializing new game');
    this.health = 100;
    this.score = 0;
    this.level = 1;
    this.paused = false;
    this.isPlaying = false;
  }

  onSetScore(trees) {
    this.score = this.score + (trees * this.level * 10);
  }
}

export default GameStore;
