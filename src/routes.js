import React from 'react';
import { Route, IndexRoute } from 'react-router';
import requireAuth from './components/require_authentication';
import App from './components/app';
import Welcome from './components/welcome';
import Repo from './components/repo';
import About from './components/about';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Welcome} />
    <Route path="about" component={About} />
    <Route path="repos(/:page)" component={requireAuth(Repo)} />
  </Route>
);
