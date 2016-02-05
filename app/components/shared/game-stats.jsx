import React, { Component, PropTypes } from 'react';
import connect from 'connect-alt';

if (process.env.BROWSER) require('styles/game-stats.scss');

@connect(({ game }) => ({ game }))
class GameStats extends Component {

  static propTypes = {
    game: PropTypes.object.isRequired
  }


  render() {
    const { game } = this.props;

    return (
      <div className='gamestats'>
        <span className='score'>Score: { game.score }</span>
        <span className='lives'>Lives: { game.health }</span>
      </div>
    );
  }
}

export default GameStats;
