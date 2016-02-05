import React, { Component, PropTypes } from 'react';

class Guides extends Component {

  static contextTypes = {
    flux: PropTypes.object.isRequired,
    i18n: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { flux, i18n } = this.context;

    return flux.getActions('helmet')
      .update({ title: i18n('guides.page-title'), description: i18n('guides.page-description') });
  }

  render() {
    const { i18n } = this.context;
    return (
      <div>
        <h1>{ i18n('guides.pageh1') }</h1>
        <p>{ i18n('guides.coming-soon') }</p>
      </div>
    );
  }

}

export default Guides;
