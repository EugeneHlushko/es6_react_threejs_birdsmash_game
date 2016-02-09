import React, { Component, PropTypes } from 'react';
import connect from 'connect-alt';
import { Link } from 'react-router';

import LangPicker from 'components/shared/lang-picker';

if (process.env.BROWSER) require('styles/header.scss');

@connect(({ session: { session } }) =>
  ({ session }))
class Header extends Component {

  static propTypes = {
    session: PropTypes.object
  }

  static contextTypes = {
    locales: PropTypes.array.isRequired,
    flux: PropTypes.object.isRequired,
    i18n: PropTypes.func.isRequired
  }

  handleLocaleChange(locale) {
    const { flux } = this.context;
    flux.getActions('locale').switchLocale({ locale });
  }

  handleLogout() {
    const { flux } = this.context;
    flux.getActions('session').logout();
  }

  render() {
    const { session } = this.props;
    const { locales: [ activeLocale ], i18n } = this.context;

    return (
      <header className='app--header'>

        {/* Links in the navbar */}
        <ul className='app--navbar text-center reset-list un-select'>
          <li>
            <Link to={ i18n('homepage.play.url') }>
              { i18n('homepage.play.title') }
            </Link>
          </li>
          { session ?
            [
              <li key={ 0 }>
                <Link to={ i18n('routes.account') }>
                  { i18n('header.account') }
                </Link>
              </li>,
              <li key={ 1 }>
                <a href='#' onClick={ ::this.handleLogout }>
                  { i18n('header.logout') }
                </a>
              </li>
            ] :
            <li>
              <Link to={ i18n('routes.login') }>
                { i18n('header.login') }
              </Link>
            </li>
          }
        </ul>

        {/* LangPicker on the right side */}
        <LangPicker
          activeLocale={ activeLocale }
          onChange={ ::this.handleLocaleChange } />
      </header>
    );
  }
}

export default Header;
