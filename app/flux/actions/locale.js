import debug from 'debug';
import intlLoader from 'utils/intl-loader';

class LocaleActions {

  switchLocale(payload) {
    // return directly action payload to stores when:
    //   - on app bootstrap (client-side)
    //   - on server routing (server-side)
    if (payload.messages) return payload;

    // async load the data for the locale
    return async (dispatch) => {
      const { messages } = await intlLoader(payload.locale);
      if (process.env.BROWSER) {
        const history = require('utils/router-history');
        const url = payload.locale === 'en' ? '/' : `/${payload.locale}`;
        const [ , nextPath = url ] = [];
        debug('dev')(window.location.pathname);
        // see from pathname if we currently have language code in the url,
        // if not
          // if we are not switching to en
            // we will add it to the pathname
        // if yes
          // if new location is not en
            // we will add it to url and replacestate
          // else we will
        history.replaceState(null, nextPath);
      }
      return dispatch({ locale: payload.locale, messages });
    };
  }
}

export default LocaleActions;
