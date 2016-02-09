import debug from 'debug';

class HighscoresStore {

  constructor() {
    this.bindActions(this.alt.getActions('highscores'));

    this.collection = [];
    this.error = null;
  }


  onIndexSuccess(highscores) {
    this.collection = highscores;
    this.error = null;
  }

  onIndexFail({ error }) {
    this.error = error;
  }

  onAddSuccess(data) {
    debug('dev')('add was successfull in the store, ', data);
  }

  onAddFail(data) {
    debug('dev')('add FAILED in the store, ', data);
  }

}

export default HighscoresStore;
