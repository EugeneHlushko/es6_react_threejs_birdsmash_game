export default {
  messages: {
    header: {
      users: 'Users List',
      guides: 'Guides',
      account: 'Account',
      logout: 'Logout',
      login: 'Login'
    },
    footer: {
      copy: 'EBUILDERS &copy; 2016 Some random english text'
    },
    homepage: {
      'page-title': 'Homepage',
      'page-description': 'Meta description of the HOMEPAGE',
      'coming-soon': 'Very cool universal(isomorphic) homepage',
      pageh1: 'Homepage'
    },
    guides: {
      'page-title': 'Guides',
      'page-description': 'Meta description of the page',
      'coming-soon': 'Page is coming soon',
      pageh1: 'Guides page'
    },
    protected: {
      'page-title': 'Protected Page'
    },
    profile: {
      'page-title': 'Profile - {fullName}',
      'not-found-page-title': 'User profile not found'
    },
    users: {
      'page-title': 'Users',
      title: 'Some random users',
      email: 'Email address',
      actions: 'Actions',
      add: 'Add random user',
      profile: 'Profile'
    },
    login: {
      help: 'Any credentials will work, it creates a fake session for example.',
      username: {
        label: 'Login',
        placeholder: 'example@app.com'
      },
      password: {
        label: 'Password'
      },
      submit: 'Submit'
    },
    routes: {
      users: '/users',
      guides: '/guides',
      login: '/login',
      profile: '/profile/:seed',
      account: '/account'
    }
  }
};
