import React, { Component, PropTypes } from 'react';
import connect from 'connect-alt';
import debug from 'debug';
import OneScore from 'components/highscores/onescore';

@connect(({ highscores }) => ({ highscores }))
class Highscores extends Component {

  static contextTypes = {
    flux: PropTypes.object.isRequired,
    i18n: PropTypes.func.isRequired
  }

  static propTypes = {
    highscores: PropTypes.object.isRequired
  }

  render() {
    const { i18n, flux } = this.context;
    const { highscores } = this.props;

    flux.getActions('highscores').index();

    debug('dev')('All highscores!', highscores);

    return (
      <div>
        <h1 className='hh-heading'>
          { i18n('highscores.heading') }
        </h1>
        { highscores.collection.map((item, key) => {
          <OneScore items={ item } key={ key } />;
        }) }
      </div>
    );
  }

}

export default Highscores;
