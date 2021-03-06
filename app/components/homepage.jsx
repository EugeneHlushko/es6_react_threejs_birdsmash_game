import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Highscores from 'components/highscores/highscores';

if (process.env.BROWSER) require('styles/homepage.css');

class Homepage extends Component {

  static contextTypes = {
    flux: PropTypes.object.isRequired,
    i18n: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { flux, i18n } = this.context;

    return flux.getActions('helmet').update({
      title: i18n('homepage.page-title'),
      description: i18n('homepage.page-description')
    });
  }

  render() {
    const { i18n } = this.context;
    return (
      <div className='homepage'>
        <h1>{ i18n('homepage.h1') }</h1>
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

export default Homepage;
