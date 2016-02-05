class GameStore {

  constructor() {
    this.bindActions(this.alt.getActions('game'));
  }
}

export default GameStore;
