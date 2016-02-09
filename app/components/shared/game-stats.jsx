import React, { Component, PropTypes } from 'react';
import connect from 'connect-alt';
import debug from 'debug';

if (process.env.BROWSER) require('styles/game-stats.scss');

@connect(({ game }) => ({ game }))
class GameStats extends Component {

  static propTypes = {
    game: PropTypes.object.isRequired
  }

  render() {
    const { game } = this.props;

    debug('dev')('game is playing? header: ', game);

    return (
      <div className='gamestats'>
        { game.isPlaying ?
          [
            <div className='gamestats'>
              <span className='score'>Score: { game.score }</span>
              <span className='lives'>Lives: { game.health }</span>
              <span className='level'>Level: { game.level }</span>
            </div>
          ] :
          <div></div>
        }
      </div>
    );
  }
}

export default GameStats;
