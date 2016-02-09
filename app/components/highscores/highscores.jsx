import React, { Component, PropTypes } from 'react';
import connect from 'connect-alt';
import Onescore from 'components/highscores/onescore';

if (process.env.BROWSER) require('styles/highscores.scss');

@connect(({ highscores }) => ({ highscores }))
class Highscores extends Component {

  static contextTypes = {
    flux: PropTypes.object.isRequired,
    i18n: PropTypes.func.isRequired
  }

  static propTypes = {
    highscores: PropTypes.object.isRequired
  }

  componentWillMount() {
    const { flux } = this.context;
    flux.getActions('highscores').index();
  }

  render() {
    const { i18n } = this.context;
    const { highscores } = this.props;

    return (
      <div>
        <h1 className='hh-heading'>
          { i18n('highscores.heading') }
        </h1>
        { highscores.collection.map((item, key) => {
          return <Onescore item={ item } key={ key } />;
        }) }
      </div>
    );
  }

}

export default Highscores;
