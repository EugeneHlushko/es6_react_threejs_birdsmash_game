import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Highscores from 'components/highscores/highscores';
import connect from 'connect-alt';

if (process.env.BROWSER) require('styles/homepage.css');

@connect(({ game }) => ({ game }))
class Gameover extends Component {

  static contextTypes = {
    flux: PropTypes.object.isRequired,
    i18n: PropTypes.func.isRequired
  }

  static propTypes = {
    game: PropTypes.object.isRequired
  }

  componentWillMount() {
    const { flux, i18n } = this.context;

    return flux.getActions('helmet').update({
      title: i18n('gameover.page-title')
    });
  }

  render() {
    const { i18n } = this.context;
    const { game } = this.props;

    return (
      <div className='homepage'>
        <h1>{ i18n('gameover.page-title') }</h1>
        <p>
          { i18n('gameover.yourscore') }: { game.score }
        </p>
        <div className='button'>
          <Link to={ i18n('homepage.play.url') }>
            { i18n('homepage.play.title') }
          </Link>
        </div>
        <Highscores />
      </div>
    );
  }
}

export default Gameover;
