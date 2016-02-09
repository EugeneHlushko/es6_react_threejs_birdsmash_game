class HighscoresActions {

  constructor() {
    this.generateActions(
      'indexSuccess', 'indexFail',
      'add'
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

}

export default HighscoresActions;
