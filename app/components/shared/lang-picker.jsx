import React, { Component, PropTypes } from 'react';
import cx from 'classnames';

if (process.env.BROWSER) require('styles/lang-picker.scss');

class LangPicker extends Component {

  static propTypes = {
    activeLocale: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
  }

  locales = [ 'ru', 'en' ]

  render() {
    const { onChange, activeLocale } = this.props;

    return (
      <ul className='lang--picker un-select'>
        { this.locales.map((locale, index) =>
          <li key={ index }>
            <a
              className={ cx({ active: locale === activeLocale }) }
              onClick={ () => onChange(locale) }>
              { locale }
            </a>
          </li>) }
      </ul>
    );
  }
}

export default LangPicker;
