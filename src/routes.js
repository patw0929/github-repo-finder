import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/app';
import Repo from './components/repo';
import About from './components/about';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Repo} />
    <Route path="about" component={About} />
  </Route>
);
