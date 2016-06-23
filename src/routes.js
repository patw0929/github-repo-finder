import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/app';
import About from './pages/about';

export default (
  <Route path="/" component={App}>
    <IndexRoute />
    <Route path="about" component={About} />
  </Route>
);
