import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Router, hashHistory, browserHistory } from 'react-router';
import routes from './routes';

import reducers from './reducers';

const createStoreWithMiddleware = applyMiddleware()(createStore);

// Use hash location for Github Pages
// but switch to HTML5 history locally.
const history = process.env.NODE_ENV === 'production' ?
  hashHistory : browserHistory;

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <Router history={history} routes={routes} />
  </Provider>
  , document.querySelector('.container'));
