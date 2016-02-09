import React, { Component, PropTypes } from 'react';

class Onescore extends Component {

  static contextTypes = {
    flux: PropTypes.object.isRequired,
    i18n: PropTypes.func.isRequired
  }

  static propTypes = {
    item: PropTypes.object.isRequired
  }

  render() {
    const { item } = this.props;

    return (
      <div className='hh-item'>
        <div className='hh-item-name'>
          { item.name }
        </div>
        <div className='hh-item-score'>
          { item.score }
        </div>
      </div>
    );
  }

}

export default Onescore;
