import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

if (process.env.BROWSER) require('styles/homepage.css');

class Homepage extends Component {

  static contextTypes = {
    flux: PropTypes.object.isRequired,
    i18n: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { flux, i18n } = this.context;

    return flux.getActions('helmet').update({
      title: i18n('gameover.page-title')
    });
  }

  render() {
    const { i18n } = this.context;
    return (
      <div className='homepage'>
        <h1>{ i18n('gameover.page-title') }</h1>
        <div className='button'>
          <Link to={ i18n('homepage.play.url') }>
            { i18n('homepage.play.title') }
          </Link>
        </div>
      </div>
    );
  }
}

export default Homepage;
