class HighscoresActions {

  constructor() {
    this.generateActions(
      'indexSuccess', 'indexFail'
    );
  }

  index() {
    return (dispatch, alt) =>
      alt.resolve(async () => {
        try {
          alt.getActions('requests').start();
          const response = await alt.request({ url: '/highscores' });
          this.indexSuccess(response);
        } catch (error) {
          this.indexFail({ error });
        }
        alt.getActions('requests').stop();
      });
  }

  // data is an object of score and name to store
  add(score, name) {
    return (dispatch, alt) =>
      alt.resolve(async () => {
        try {
          alt.getActions('requests').start();
          const response = await alt.request({ url: `/highscores/add?name=${name}&score=${score}` });
          this.indexSuccess(response);
        } catch (error) {
          this.indexFail({ error });
        }
        alt.getActions('requests').stop();
      });
  }
}

export default HighscoresActions;
