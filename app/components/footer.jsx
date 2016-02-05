import React, { Component, PropTypes } from 'react';
import connect from 'connect-alt';

@connect(({ requests: { inProgress }, session: { session } }) =>
  ({ inProgress, session }))
class Footer extends Component {

  static propTypes = {
    inProgress: PropTypes.bool,
    session: PropTypes.object
  }

  static contextTypes = {
    locales: PropTypes.array.isRequired,
    flux: PropTypes.object.isRequired,
    i18n: PropTypes.func.isRequired
  }

  render() {
    const { i18n } = this.context;

    return (
      <footer className='app--footer'>
        <div className='app--footer-content'>
          { i18n('footer.copy') }
        </div>
      </footer>
    );
  }

}

export default Footer;
