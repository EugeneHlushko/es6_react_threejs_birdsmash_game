import React, { Component, PropTypes } from 'react';
import Homepagegl from './homepagegl';

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
    //const { i18n } = this.context;
    return (
      <div>
        <Homepagegl />
      </div>
    );
  }
}

export default Homepage;
