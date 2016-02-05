import React from 'react';
import { Route } from 'react-router';

import { generateRoute } from 'utils/localized-routes';
import { isConnected } from 'utils/routes-hooks';

export default function (flux) { /* eslint react/display-name: 0 */
  return (
    <Route component={ require('./components/app') }>
      { generateRoute({
        paths: [ '/', '/en', '/ru' ],
        component: require('./components/homepage')
      }) }
      { generateRoute({
        paths: [ '/users', '/ru/users' ],
        component: require('./components/users')
      }) }
      { generateRoute({
        paths: [ '/account', '/ru/account' ],
        component: require('./pages/account'),
        onEnter: isConnected(flux)
      }) }
      { generateRoute({
        paths: [ '/guides', '/ru/guides' ],
        component: require('./components/guides')
      }) }
      { generateRoute({
        paths: [ '/profile/:seed', '/ru/profile/:seed' ],
        component: require('./components/profile')
      }) }
      { generateRoute({
        paths: [ '/login', '/ru/login' ],
        component: require('./pages/login')
      }) }
      <Route path='*' component={ require('./pages/not-found') } />
    </Route>
  );
}
