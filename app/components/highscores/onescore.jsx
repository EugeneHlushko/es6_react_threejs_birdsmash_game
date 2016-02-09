import React, { Component, PropTypes } from 'react';
import debug from 'debug';

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

    debug('dev')('Rendering one item!', item);

    return (
      <div className='hh-item'>
        { item.name } { item.score }
      </div>
    );
  }

}

export default Onescore;
