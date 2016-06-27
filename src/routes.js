import React from 'react';
import { Route, IndexRoute } from 'react-router';
import requireAuth from './components/require_authentication';
import App from './components/app';
import Welcome from './components/welcome';
import Repos from './components/repos';
import Tags from './components/tags';
import About from './components/about';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Welcome} />
    <Route path="repos(/:keyword)(/:page)" component={requireAuth(Repos)} />
    <Route path="tags(/:keyword)(/:page)" component={requireAuth(Tags)} />
    <Route path="about" component={About} />
  </Route>
);
